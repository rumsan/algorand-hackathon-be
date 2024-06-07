import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateVoucherDto {

    @IsString()
    @IsNotEmpty()
    voucherSymbol: string

    @IsString()
    @IsOptional()
    assetId: number

}
