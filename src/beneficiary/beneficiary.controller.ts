import {
  Controller,
  Get,
  Body,
  Res,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto, GetBeneficiaryDto } from './dto/send-mail.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('beneficiary')
@ApiTags('Beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get()
  @ApiOperation({ summary: 'List of all Beneficiary' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'walletAddress', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getBlogs(
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() getBeneficiaryDto: GetBeneficiaryDto,
  ) {
    console.log('getBeneficiaryDto', getBeneficiaryDto);
    const { email, walletAddress } = getBeneficiaryDto;
    const search = { email, walletAddress };

    return this.beneficiaryService.findAll(limit, page, search);
  }
  @Post('create-ben')
  sendMail(@Body() sendMailDTO: CreateBeneficiaryDto, @Res() response: any) {
    // console.log('pugyo yeha samma');
    // console.log('sendMailDTO', sendMailDTO);
    const mail = this.beneficiaryService.sendMail(sendMailDTO);

    return response.status(200).json({
      message: 'success',
      mail,
    });
  }

  
}
