import { PartialType } from '@nestjs/swagger';
import { CreateMultisigDto } from './create-multisig.dto';

export class UpdateMultisigDto extends PartialType(CreateMultisigDto) {}
