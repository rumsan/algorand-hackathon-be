import { HttpException, Injectable, Param } from '@nestjs/common';
import { CreateMultisigDto } from './dto/create-multisig.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class MultisigService {

  constructor(private prisma: PrismaAppService) {}
  
  async create(createMultisigDto: CreateMultisigDto) {

    const msigThreshold = Number(process.env.MSIG_THRESHOLD);

    const totalSignatures = await this.prisma.msig.count({
      where: {
        projectId: createMultisigDto.projectId
      }
    })

    if(totalSignatures >= msigThreshold) {
      throw new HttpException('Sufficient number of signature.', 501)
    }
    
    return await this.prisma.msig.create({
      data: createMultisigDto
    })

  }

  async findMany(id: string) {
    return await this.prisma.msig.findMany({
      where: {
        projectId: id
      }
    })
  }

  async remove(id: string) {
    return await this.prisma.msig.deleteMany({
        where: {
          projectId: id
        }
    })
  }

}
