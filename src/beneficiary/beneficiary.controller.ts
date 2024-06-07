import {
  Controller,
  Get,
  Body,
  Res,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto, GetBeneficiaryDto, UpdateBeneficiaryDto } from './dto/send-mail.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('beneficiary')
@ApiTags('Beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}


  @Get('/beneficiaries-age-data')
  async getBeneficiariesAgeData() {
    return this.beneficiaryService.totalProjectBeneficiaryAge();
  }

  @Get('/get-count')
  async getCount() {
    try {
      return await this.beneficiaryService.countProjectsBeneficiary();
    } catch (e) {
      console.log('error', e);
      return e;
    }
  }
  @Get('/count-gender')
  getGenderCount() {
    return this.beneficiaryService.countGender();
  }

  @Get('find-by-wallet/:id')
  async findByWallet(@Param('id') id: string) {
    return this.beneficiaryService.findByWalletAddress(id);
  }

  @Get('/:id')
  async getBeneficiary(@Param('id') id: string) {
    console.log('id', id);
    return this.beneficiaryService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'List of all Beneficiary' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'walletAddress', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllBeneficiary(
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() getBeneficiaryDto: GetBeneficiaryDto,
  ) {
    // console.log('getBeneficiaryDto', getBeneficiaryDto);
    const { email, walletAddress } = getBeneficiaryDto;
    const search = { email, walletAddress };

    const res = this.beneficiaryService.findAll(limit, page, search);
    //  console.log('res', res);
    return res;
  }
  @Post('create-ben')
  sendMail(@Body() sendMailDTO: CreateBeneficiaryDto, @Res() response: any) {
    return this.beneficiaryService.sendMail(sendMailDTO);
  }


  @Patch('/:id')
  updateBulkBeneficiary(@Body() beneficiaryData: UpdateBeneficiaryDto) {
    return this.beneficiaryService.updateBulkBeneficiary(beneficiaryData)
  }
  
}
