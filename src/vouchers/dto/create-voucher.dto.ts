import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({
    description: 'Project UUID',
    example: 'c7b8c2c3-7c8d-4c8b-9c8d-4c8b9c8d4c8b',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Voucher name',
    example: 'Voucher Alpha',
  })
  @IsString()
  @IsNotEmpty()
  voucherName: string;

  @ApiProperty({
    description: 'Voucher symbol',
    example: 'ALPHA',
  })
  @IsString()
  @IsNotEmpty()
  voucherSymbol: string;

  @ApiProperty({
    description: 'Asset ID',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  assetId: string;
}
