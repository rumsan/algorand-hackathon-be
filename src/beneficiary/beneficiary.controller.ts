import { Controller, Get, Body, Res, Post } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/send-mail.dto'

@Controller('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Post('create-ben')
  sendMail(@Body() sendMailDTO: CreateBeneficiaryDto, @Res() response: any) {
    const mail = this.beneficiaryService.sendMail(sendMailDTO);

    return response.status(200).json({
      message: 'success',
      mail,
    });
  }
 
  @Post('add')
  create(@Body() sendMailDTO: CreateBeneficiaryDto){
    
  }

  
}
