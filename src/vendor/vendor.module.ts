import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';

@Module({
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
