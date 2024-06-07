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
    description: 'Array of admin addresses',
    example: ['0x123...', '0x456...'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  adminAddress: string[];

  @ApiProperty({
    description: 'Project Images',
    example: 'This is a project Image Url',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    description: 'Super Admin Address',
    example: 'This is a project Image Url',
  })
  @IsString()
  superAdmin: string;

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
