import { HttpException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor (private prisma: PrismaAppService) {}
  async create(createVoucherDto: CreateVoucherDto) {
    
    const voucher = await this.prisma.voucher.findUnique({
      where: {voucherSymbol: createVoucherDto.voucherSymbol}
    })
    if(voucher) throw new HttpException('Voucher with this symbol already exists', 409)
      
    return this.prisma.voucher.create({
      data: {
        voucherName: createVoucherDto.voucherName,
        voucherSymbol: createVoucherDto.voucherSymbol,
        assetId: +createVoucherDto.assetId
      }
    })
  }

  findAll() {
    return this.prisma.voucher.findMany({});
  }

  findOne(voucherSymbol: string) {
    return this.prisma.voucher.findUnique({where: {voucherSymbol}});
  }

}
