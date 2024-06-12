import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as QRCode from 'qrcode';
import { decryptMessage } from 'src/utils/decrypt';

@Injectable()
export class VendorService {
  constructor(
    private prisma: PrismaAppService,
    private readonly mailService: MailerService,
  ) {}
  async create(createVendorDto: CreateVendorDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const vendor = await prisma.vendor.create({
        data: {
          email: createVendorDto.email,
          name: createVendorDto.name,
          location: createVendorDto.location,
          walletAddress: createVendorDto.walletAddress,
          project: {
            connect: { uuid: createVendorDto.projectId },
          },
        },
      });

      await prisma.project.update({
        where: { uuid: createVendorDto.projectId },
        data: {
          vendorId: vendor.uuid,
        },
      });
      await this.mailService.sendMail({
        from: 'Rahat <asimneupane11@gmail.com>',
        to: createVendorDto.email,
        subject: `Welcome to Rahat`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #4CAF50;">Welcome to Rahat</h1>
            <p>Dear Vendor,</p>
            <p>You have been added as a vendor in Rahat. You can view your details by
                <a href="${process.env.FRONTEND_URL}vendor/details/${createVendorDto.walletAddress}" style="color: #4CAF50;">clicking here</a>.
            </p>
            <br/>
            <p>Best Regards,</p>
            <p>Rahat Team</p>
        </div>
    `,
      });

      return vendor;
    });

    return result;
  }

  async findAll() {
    return await this.prisma.vendor.findMany();
  }

  async findOne(walletAddress: string, ): Promise<any> {

    const resp = await this.prisma.vendor.findUnique({
      where: { walletAddress },
    });
    if (!resp) {
      throw new NotFoundException('vendor not found');
    }
    const project = await this.prisma.project.findUnique({
      where: { uuid: resp.projectId },
    });

    const voucherId = project.voucherId;
    return { resp, voucherId };
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
