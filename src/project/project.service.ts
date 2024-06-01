import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getReturn } from 'src/beneficiary/beneficiary.service';
import { Project } from '@prisma/client';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaAppService) {}

  create(
    createProjectDto: CreateProjectDto,
  ): Promise<Prisma.ProjectCreateInput> {
    return this.prisma.project.create({
      data: { ...createProjectDto },
    });
  }

  // Find All project
  async findAll(
    limit?: number,
    page?: number,
    search?: { projectName?: string },
  ): Promise<getReturn> {
    console.log(limit, page, search);
    const pageNum = page;
    const size = limit;

    const whereCondition: any = {
      AND: [],
    };
    if (search.projectName) {
      whereCondition.name = search.projectName;
    }

    // Get total count
    const total = await this.prisma.beneficiary.count({
      where: whereCondition,
    });

    console.log(whereCondition);
    // Fetch paginated data
    const data = await this.prisma.beneficiary.findMany({
      where: whereCondition,
      skip: (pageNum - 1) * size,
      take: size,
    });

    return { data, total, limit: size, page: pageNum };
  }

  // Find all beneficiary in a single project 
  async findAllBeneficiary(
    id: string,
    limit?: number,
    page?: number,
  ): Promise<any> {
    console.log(limit, page);
    const pageNum = page;
    const size = limit;

    const projectWithBeneficiaries = this.prisma.project.findUnique({
      where: { uuid: id },
      select: {
        beneficiaries: {
          skip: (pageNum - 1) * size,
          take: size,
        },
        _count: {
          select: { beneficiaries: true },
        },
      },
    });
    if (!projectWithBeneficiaries) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    return {
      data: projectWithBeneficiaries.beneficiaries,
      total: (await projectWithBeneficiaries)._count.beneficiaries,
      limit: size,
      page: pageNum,
    };
  }

  findOne(id: string) {
    const result = this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);

    return result;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    const result = this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);
    return this.prisma.project.update({
      where: { uuid: id },
      data: { name: updateProjectDto.name },
    });
  }
  // Add  array of beneficiaries to the project
  addBeneficiary(id: string, beneficiaryId: Array<string>) {
    const result = this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);
    return this.prisma.project.update({
      where: { uuid: id },
      data: {
        beneficiaries: {
          connect: beneficiaryId.map((id) => ({ uuid: id })),
        },
      },
    });
  }

  // Add new admin to the project
  async addAdmin(id: string, adminIds: string[]): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { uuid: id },
      select: { adminAddress: true }, // Only select the adminAddress field
    });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.project.update({
      where: { uuid: id },
      data: {
        adminAddress: {
          set: [...project.adminAddress, ...adminIds],
        },
      },
    });
  }

  // soft delete project by id
  async remove(id: string, isArchived: boolean): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.project.update({
      where: { uuid: id },
      data: { isArchived },
    });
  }
}
