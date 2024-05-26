import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBeneficiaryDto {
  @ApiProperty({
    description: 'Email of the beneficiary',
    example: 'beneficiary@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

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
  @IsString()
  gender: string;

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
    description: 'title of the blog',
    example: 'Nepal the great',
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
