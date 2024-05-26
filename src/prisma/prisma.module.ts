import { Global, Module } from '@nestjs/common';
import { PrismaAppService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaAppService],
  exports: [PrismaAppService],
})
export class PrismaModule {}
