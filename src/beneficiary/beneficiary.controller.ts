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
} from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto, GetBeneficiaryDto } from './dto/send-mail.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('beneficiary')
@ApiTags('Beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get(':walletAddress')
  async getBeneficiary(@Param('walletAddress') id: string) {
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
  getBlogs(
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
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

  // @Post('add-project')
  // async addProject(
  //   @Body('ids') ids: string[],
  //   @Body('projectId') projectId: string,
  // ): Promise<void> {
  //   await this.beneficiaryService.addProject(ids, projectId);
  // }
}
