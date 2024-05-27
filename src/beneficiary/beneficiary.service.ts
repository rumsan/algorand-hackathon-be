import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBeneficiaryDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaAppService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import { decryptMessage } from 'src/utils/decrypt';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly mailService: MailerService,
    private prisma: PrismaAppService,
  ) {}

  async sendMail(CreateBeneficiaryDto: CreateBeneficiaryDto) {
    const qrCodeBuffer = await QRCode.toBuffer(
      decryptMessage(CreateBeneficiaryDto.mnemonics),
    );

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const beneficiary = await prisma.beneficiary.findUnique({
          where: { email: CreateBeneficiaryDto?.email },
        });

        if (beneficiary)
          throw new ConflictException('Beneficiary already exists');

        const createUser = await prisma.beneficiary.create({
          data: {
            email: CreateBeneficiaryDto?.email,
            name: CreateBeneficiaryDto?.name,
            age: CreateBeneficiaryDto?.age,
            gender: CreateBeneficiaryDto?.gender,
            walletAddress: CreateBeneficiaryDto?.walletAddress,
          },
        });

        await this.mailService.sendMail({
          from: 'Rahat <sushant.rumsan@gmail.com>',
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

        return createUser;
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
