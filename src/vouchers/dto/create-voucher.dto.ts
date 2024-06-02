import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVoucherDto {

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  voucherName: string;

  @IsString()
  @IsNotEmpty()
  voucherSymbol: string;

  @IsString()
  @IsNotEmpty()
  assetId: string;
}
