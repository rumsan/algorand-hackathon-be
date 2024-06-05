import { HttpException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaAppService) {}
  async create(createVoucherDto: CreateVoucherDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if a voucher with the same symbol already exists
        const existingVoucher = await prisma.voucher.findUnique({
          where: { voucherSymbol: createVoucherDto.voucherSymbol },
        });
        if (existingVoucher) {
          throw new HttpException(
            'Voucher with this symbol already exists',
            409,
          );
        }

        // Find the project by UUID
        const project = await prisma.project.findUnique({
          where: { uuid: createVoucherDto.projectId },
        });

        // Check if the project already has a voucher
        if (project?.voucherId !== null) {
          throw new HttpException('This project already has a voucher', 409);
        }

        // Check if the asset ID is already used in any project
        const isInAnyProject = await prisma.project.findFirst({
          where: { voucherId: +createVoucherDto.assetId },
        });
        if (isInAnyProject) {
          throw new HttpException(
            `This voucher is already used in ${isInAnyProject.name}`,
            409,
          );
        }

        // Create the new voucher
        const newVoucher = await prisma.voucher.create({
          data: {
            voucherName: createVoucherDto.voucherName,
            voucherSymbol: createVoucherDto.voucherSymbol,
            assetId: +createVoucherDto.assetId,
          },
        });

        // Update the project to link the newly created voucher
        await prisma.project.update({
          where: { uuid: createVoucherDto.projectId },
          data: {
            voucherId: newVoucher.assetId,
          },
        });

        return newVoucher;
      });
    } catch (e) {
      console.error(e);
      throw e; // rethrow the error after logging it
    }
  }

  findAll() {
    return this.prisma.voucher.findMany({});
  }

  async findOne(assetId: number) {
    return await this.prisma.voucher.findUnique({ where: { assetId } });
  }

  async findSymbol(voucherSymbol: string) {
    return await this.prisma.voucher.findUnique({ where: { voucherSymbol } });
  }
}
