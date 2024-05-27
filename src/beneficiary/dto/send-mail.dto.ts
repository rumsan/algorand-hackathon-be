import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateBeneficiaryDto {

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    age: number

    @IsNotEmpty()
    @IsString()
    gender: string

    @IsNotEmpty()
    @IsString()
    walletAddress: string
    

    @IsNotEmpty()
    @IsString()
    mnemonics: string
    
}


