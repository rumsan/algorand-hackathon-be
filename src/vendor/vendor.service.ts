import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaAppService) {}
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

      return vendor;
    });

    return result;
  }

  async findAll() {
    return await this.prisma.vendor.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}