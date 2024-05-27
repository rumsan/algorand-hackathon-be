import { Controller, Get, Body, Res, Post } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/send-mail.dto'

@Controller('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Post('create-ben')
  sendMail(@Body() sendMailDTO: CreateBeneficiaryDto, @Res() response: any) {
    return this.beneficiaryService.sendMail(sendMailDTO);
  }
 
  @Post('add')
  create(@Body() sendMailDTO: CreateBeneficiaryDto){
    
  }

  
}
