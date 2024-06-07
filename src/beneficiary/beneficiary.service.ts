import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaAppService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import { decryptMessage } from 'src/utils/decrypt';

export type getReturn = {
  data: any[];
  total: number;
  limit: number;
  page: number;
};

  const ageRanges = [
  { label: '0-10', min: 0, max: 10 },
  { label: '11-20', min: 11, max: 20 },
  { label: '21-30', min: 21, max: 30 },
  { label: '31-40', min: 31, max: 40 },
  { label: '41-50', min: 41, max: 50 },
  { label: '51-60', min: 51, max: 60 },
  { label: '61-70', min: 61, max: 70 },
  { label: '71-80', min: 71, max: 80 },
  { label: '81-90', min: 81, max: 90 },
  { label: '91-100', min: 91, max: 100 },
];


@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly mailService: MailerService,
    private prisma: PrismaAppService,
  ) {}

  async TotalProjectBeneficiaryAge() {
    return await this.getBeneficiaryAgeGroups();
  }
  private groupByAge(beneficiaries: { age: number }[]): {
    [key: string]: number;
  } {
    const ageGroups = ageRanges.reduce(
      (acc, range) => {
        acc[range.label] = 0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    beneficiaries.forEach(({ age }) => {
      const range = ageRanges.find(
        (range) => age >= range.min && age <= range.max,
      );
      if (range) {
        ageGroups[range.label]++;
      }
    });

    return ageGroups;
  }

  async getBeneficiaryAgeGroups(): Promise<{ [key: string]: number }> {
    const beneficiaries = await this.prisma.beneficiary.findMany({
      select: { age: true },
    });

    return this.groupByAge(beneficiaries);
  }

  async sendMail(CreateBeneficiaryDto: CreateBeneficiaryDto) {
    const qrCodeBuffer = await QRCode.toBuffer(
      decryptMessage(CreateBeneficiaryDto.mnemonics),
    );

    const ben = await this.prisma.beneficiary.findUnique({
      where: { walletAddress: CreateBeneficiaryDto.walletAddress },
    });

    if (ben) {
      console.log('Adding to existing ben');
      return await this.prisma.beneficiary.update({
        where: {
          walletAddress: CreateBeneficiaryDto.walletAddress,
        },
        data: {
          projects: {
            connect: { uuid: CreateBeneficiaryDto.projectId },
          },
        },
      });
    } else {
      console.log('Creating new ben');
      try {
        const createdBeneficiary = await this.prisma.$transaction(
          async (prisma) => {
            const existingBeneficiary = await prisma.beneficiary.findUnique({
              where: { email: CreateBeneficiaryDto?.email },
            });

            if (existingBeneficiary) {
              throw new ConflictException('Beneficiary already exists');
            }

            const newBeneficiary = await prisma.beneficiary.create({
              data: {
                email: CreateBeneficiaryDto.email,
                name: CreateBeneficiaryDto.name,
                age: CreateBeneficiaryDto.age,
                gender: CreateBeneficiaryDto.gender,
                walletAddress: CreateBeneficiaryDto.walletAddress,
                projects: {
                  connect: { uuid: CreateBeneficiaryDto.projectId },
                },
              },
            });

            return newBeneficiary;
          },
        );

        const mailResult = await this.mailService.sendMail({
          from: 'Rahat <asimneupane11@gmail.com>',
          to: CreateBeneficiaryDto.email,
          subject: `Welcome to Rahat`,
          html: `<h2>Welcome to rahat</h2><p>You have been added as a beneficiary in Rahat. </p><p>Download Pera wallet and scan the QR code below:</p><img width="300" height="300" src="cid:qrcode@nodemailer"/>`,
          attachments: [
            {
              filename: 'qrcode.png',
              content: qrCodeBuffer,
              cid: 'qrcode@nodemailer',
            },
          ],
        });

        return mailResult;
      } catch (error) {
        console.error('Error occurred while creating beneficiary:', error);
        throw error; // Re-throw the error to handle it at a higher level
      }
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    search?: { email?: string; walletAddress?: string },
  ): Promise<getReturn> {
    const pageNum = page;
    const size = limit;

    const whereCondition: Record<any, any> = {};
    if (search?.email) {
      whereCondition.email = search.email;
    }

    if (search?.walletAddress) {
      whereCondition.walletAddress = search.walletAddress;
    }

    // Get total count
    const total = await this.prisma.beneficiary.count({
      where: whereCondition,
    });

    console.log(whereCondition);
    // Fetch paginated data
    const data = await this.prisma.beneficiary.findMany({
      where: whereCondition,
      select: { projects: true },
      skip: (pageNum - 1) * size,
      take: size,
    });

    return { data, total, limit: size, page: pageNum };
  }

  async findOne(uuid: string): Promise<any> {
    const result = await this.prisma.beneficiary.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        email: true,
        name: true,
        age: true,
        walletAddress: true,
        projects: true,
      },
    });

    if (!result)
      throw new HttpException('Beneficiary not found', HttpStatus.BAD_REQUEST);
    return result;
  }

  async countProjectsBeneficiary(): Promise<{
    totalBeneficiary: number;
    totalProject: number;
  }> {
    console.log('get service count');
    const beneCount = await this.prisma.beneficiary.count();
    const projCount = await this.prisma.project.count();
    return { totalBeneficiary: beneCount, totalProject: projCount };
  }

  async countGender(): Promise<any> {
    const count = await this.prisma.beneficiary.groupBy({
      by: ['gender'],
      _count: true,
    });
    console.log('asfj');
    console.log(count);
    return count;
  }

  async findByWalletAddress(walletAddress: string) {
    const user = await this.prisma.beneficiary.findUnique({
      where: { walletAddress },
      include: { projects: { include: { voucher: true, vendor: true } } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateBeneficiary(id: string, string: UpdateBeneficiaryDto): Promise<any> {
    
  }
}
