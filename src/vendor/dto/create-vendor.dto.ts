import {
  IsEmail,
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateVendorDto {

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsInt()
  collectedAsa?: number;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsUUID()
  projectId: string;
}
