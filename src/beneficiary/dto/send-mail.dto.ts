import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export class CreateBeneficiaryDto {
  @ApiProperty({
    description: 'Email of the beneficiary',
    example: 'beneficiary@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Project UUID',
    example: 'c7b8c2c3-7c8d-4c8b-9c8d-4c8b9c8d4c8b',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Name of the beneficiary',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Age of the beneficiary',
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'gender of the beneficiary',
    example: 'male',
  })
  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;

  @ApiProperty({
    description: 'Wallete Address of the beneficiary',
    example: 'skdjfkowje9023ednkjwef',
  })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'mnemonics of the beneficiary',
    example: 'cat dog rat ...',
  })
  @IsNotEmpty()
  @IsString()
  mnemonics: string;
}

export class GetBeneficiaryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Email of benefiicary',
    example: 'rumsan@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Wallete Address of the beneficiary',
    example: 'skdjfkowje9023ednkjwef',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  walletAddress: string;

  @IsOptional()
  @ApiProperty({
    description: 'Page',
    example: '1',
  })
  page?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Limit',
    example: '3',
  })
  limit?: string;
}


export class UpdateBeneficiaryDto {

  @IsArray()
  @ApiProperty({
    description: 'Address of beneficiary',
    example: ['BQ63F7VH6FYQNFUK6YN6FGHI55FPE74FJT7EQ4NMBKHPT3QFSWJGXPPISA'],
  })
  addresses: string[];

  @IsString()
  @ApiProperty({
    description: 'Status (NOT_ASSIGNED, FREEZED, UNFREEZED)',
    example: 'FREEZED',
  })
  status: 'NOT_ASSIGNED' | 'FREEZED' | 'UNFREEZED';
}

export class SendAsaDto {
  @IsString()
  @ApiProperty({
    description: 'Wallet address of beneficiary',
    example: 'BQ63F7VH6FYQNFUK6YN6FGHI55FPE74FJT7EQ4NMBKHPT3QFSWJGXPPISA',
  })
  walletAddress: string
}