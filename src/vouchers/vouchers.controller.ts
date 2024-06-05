import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('vouchers')
@ApiTags('Vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Voucher' })
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get('/get-voucher-symbol/:id')
  findVoucher(@Param('id') voucherSymbol: string) {
    return this.vouchersService.findSymbol(voucherSymbol);
  }

  @Get(':id')
  findOne(@Param('id') assetId: number) {
    return this.vouchersService.findOne(assetId);
  }
}
