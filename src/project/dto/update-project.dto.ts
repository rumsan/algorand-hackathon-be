import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}


export class GetProjectDto {
 

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


