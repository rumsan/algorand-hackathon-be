import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MultisigService } from './multisig.service';
import { CreateMultisigDto } from './dto/create-multisig.dto';

@Controller('multisig')
export class MultisigController {
  constructor(private readonly multisigService: MultisigService) {}

  @Post()
  create(@Body() createMultisigDto: CreateMultisigDto) {
    return this.multisigService.create(createMultisigDto);
  }

  @Get(':id')
  findMany(@Param() param: {id: string}) {
    return this.multisigService.findMany(param.id);
  }

  @Delete(':id')
  remove(@Param() id: string) {
    return this.multisigService.remove(id);
  }
}
