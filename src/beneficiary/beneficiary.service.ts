import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBeneficiaryDto,
  SendAsaDto,
  UpdateBeneficiaryDto,
} from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaAppService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import { decryptMessage } from 'src/utils/decrypt';
import { groupByAge } from 'src/utils/groupByAge';
import * as algosdk from 'algosdk';

export type getReturn = {
  data: any[];
  total: number;
  limit: number;
  page: number;
};

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly mailService: MailerService,
    private prisma: PrismaAppService,
  ) {}

  async updateBulkBeneficiary(
    beneficiaryAddresses: UpdateBeneficiaryDto,
  ): Promise<any> {

    return await this.prisma.beneficiary.updateMany({
      where: {
        walletAddress: {
          in: beneficiaryAddresses.addresses,
        },
      },
      data: {
        status: beneficiaryAddresses.status,
      },
    });
  }

  async totalProjectBeneficiaryAge() {
    const beneficiaries = await this.prisma.beneficiary.findMany({
      select: { age: true },
    });
    return groupByAge(beneficiaries);
  }

  async sendMail(CreateBeneficiaryDto: CreateBeneficiaryDto) {
    const qrCodeBuffer = await QRCode.toBuffer(
      decryptMessage(CreateBeneficiaryDto.mnemonics),
    );

    const ben = await this.prisma.beneficiary.findUnique({
      where: { walletAddress: CreateBeneficiaryDto.walletAddress },
    });

    if (ben) {
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
      try {
        const beneficiary = await this.prisma.$transaction(async (prisma) => {
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

          await this.mailService.sendMail({
            from: 'Rahat <asimneupane11@gmail.com>',
            to: CreateBeneficiaryDto.email,
            subject: `Welcome to Rahat`,
            // html: `<h1>Welcome to rahat</h1><p>You have been added as a beneficiary in Rahat. </p><p>Download Pera wallet and scan the QR code below:</p><img width="300" height="300" src="cid:qrcode@nodemailer"/> <br/> <span>After creating wallet you can redeem your by </span> <a href='${process.env.FRONTEND_URL}beneficiary/details/${CreateBeneficiaryDto.walletAddress}'>clicking here</a>.`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #4CAF50;">Welcome to Rahat</h1>
            <p>Dear Vendor,</p>
            <p>You have been added as a vendor in Rahat.</p>
            <p>Please download the Pera wallet and scan the QR code below:</p>
            <img width="300" height="300" src="cid:qrcode@nodemailer" alt="QR Code" style="margin: 20px 0;"/>
            <p>You have been added as a beneficiary in Rahat.</p> <span>After creating wallet you can redeem your by </span> <a href='${process.env.FRONTEND_URL}beneficiary/details/${CreateBeneficiaryDto.walletAddress}'>clicking here</a>.
            </p>
            <br/>
            <p>Best Regards,</p>
            <p>Rahat Team</p>
        </div>
    `,
            attachments: [
              {
                filename: 'qrcode.png',
                content: qrCodeBuffer,
                cid: 'qrcode@nodemailer',
              },
            ],
          });
          console.log('newBeneficiary', newBeneficiary);
          return newBeneficiary;
        });

        return beneficiary;
      } catch (error) {
        console.error('Error occurred while creating beneficiary:', error);
        throw error;
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

  async sendAsaToBen(walletAddress: string) {
    const algodClient = new algosdk.Algodv2('', process.env.ALGOD_URL, '');

    const funderMnemonics = process.env.FUNDER_MNEMONICS;
    const funderWallet = process.env.FUNDER_WALLET;

    const secretOfSenderWallet = algosdk.mnemonicToSecretKey(funderMnemonics);
    const txnSender = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: funderWallet,
      to: walletAddress,
      amount: 500000,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });
    const signedTxnSender = txnSender.signTxn(secretOfSenderWallet.sk);
    await algodClient.sendRawTransaction(signedTxnSender).do();

    return 'Sent successfully';
  }
}
