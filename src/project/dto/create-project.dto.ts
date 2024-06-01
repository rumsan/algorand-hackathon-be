import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBeneficiaryDto } from '../../beneficiary/dto/send-mail.dto';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project Alpha',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Unique symbol for the project token',
    example: 'ALPHA',
  })
  @IsString()
  @Length(1, 10)
  tokenSymbol: string;

  @ApiProperty({
    description: 'Name of the project token',
    example: 'Alpha Token',
  })
  @IsString()
  @Length(1, 100)
  tokenName: string;

  @ApiProperty({
    description: 'Array of admin addresses',
    example: ['0x123...', '0x456...'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  adminAddress: string[];


//   @ApiProperty({
//     description: 'Array of beneficiaries associated with the project',
//     type: () => [CreateBeneficiaryDto],
//     isArray: true,
//   })
//   @IsOptional()
//   @IsArray()
//   @Type(() => CreateBeneficiaryDto)
//   beneficiaries: CreateBeneficiaryDto[];
}
