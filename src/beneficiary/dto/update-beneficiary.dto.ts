import { PartialType } from '@nestjs/mapped-types';
import { CreateBeneficiaryDto } from './send-mail.dto';

export class UpdateBeneficiaryDto extends PartialType(CreateBeneficiaryDto) {}
