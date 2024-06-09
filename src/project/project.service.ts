import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaAppService } from 'src/prisma/prisma.service';
import { BENEFICIARY_STATUS, Prisma } from '@prisma/client';
import { getReturn } from 'src/beneficiary/beneficiary.service';
import { Project } from '@prisma/client';

const ageRanges = [
  { label: '0-10', min: 0, max: 10 },
  { label: '11-20', min: 11, max: 20 },
  { label: '21-30', min: 21, max: 30 },
  { label: '31-40', min: 31, max: 40 },
  { label: '41-50', min: 41, max: 50 },
  { label: '51-60', min: 51, max: 60 },
  { label: '61-70', min: 61, max: 70 },
  { label: '71-80', min: 71, max: 80 },
  { label: '81-90', min: 81, max: 90 },
  { label: '91-100', min: 91, max: 100 },
];

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaAppService) {}

  // chart services for age
  async ProjectBeneficiaryAgeChart(uuid: string) {
    return await this.getBeneficiaryAgeGroups(uuid);
  }

  private groupByAge(beneficiaries: { age: number }[]): {
    [key: string]: number;
  } {
    const ageGroups = ageRanges.reduce(
      (acc, range) => {
        acc[range.label] = 0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    beneficiaries.forEach(({ age }) => {
      const range = ageRanges.find(
        (range) => age >= range.min && age <= range.max,
      );
      if (range) {
        ageGroups[range.label]++;
      }
    });

    return ageGroups;
  }

  private async getBeneficiaryAgeGroups(
    uuid: string,
  ): Promise<{ [key: string]: number }> {
    const project = await this.prisma.project.findUnique({
      where: { uuid },
      select: {
        beneficiaries: {
          select: {
            age: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.groupByAge(project.beneficiaries);
  }

  // chart service for gender

  async countGender(uuid: string): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: { uuid },
      select: {
        beneficiaries: {
          select: {
            gender: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.groupByGender(project.beneficiaries);
  }

  private groupByGender(beneficiaries: { gender: string }[]): {
    [key: string]: number;
  } {
    const genderGroups = beneficiaries.reduce(
      (acc, { gender }) => {
        if (!acc[gender]) {
          acc[gender] = 0;
        }
        acc[gender]++;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return genderGroups;
  }

  // create project
  create(
    createProjectDto: CreateProjectDto,
  ): Promise<Prisma.ProjectCreateInput> {
    return this.prisma.project.create({
      data: { ...createProjectDto, createdBy: createProjectDto.name },
    });
  }

  // Find All project
  async findAll(
    limit?: number,
    page?: number,
    search?: { name?: string },
  ): Promise<getReturn> {
    const pageNum = page;
    const size = limit;

    const whereCondition: Record<any, any> = {
      isArchived: false,
    };
    if (search?.name) {
      whereCondition.name = search.name;
    }

    // Get total count
    const total = await this.prisma.project.count({
      where: whereCondition,
    });

    // Fetch paginated data
    const data = await this.prisma.project.findMany({
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
    status?: BENEFICIARY_STATUS,
  ): Promise<any> {
    const pageNum = page;
    const size = limit;

    const projectWithBeneficiaries = await this.prisma.project.findUnique({
      where: { uuid: id },
      select: {
        beneficiaries: {
          skip: (pageNum - 1) * size,
          take: size,
          where: {
            status,
          },
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
      total: projectWithBeneficiaries._count.beneficiaries,
      limit: size,
      page: pageNum,
    };
  }

  // find one project
  async findOne(id: string) {
    const result = await this.prisma.project.findUnique({
      where: { uuid: id },
      include: { beneficiaries: true },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);

    return result;
  }

  // update project
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const result = await this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);
    return await this.prisma.project.update({
      where: { uuid: id },
      data: { name: updateProjectDto.name },
    });
  }
  // Add  array of beneficiaries to the project
  async addBeneficiary(id: string, beneficiaryId: Array<string>) {
    const result = await this.prisma.project.findUnique({
      where: { uuid: id },
    });

    if (!result)
      throw new HttpException('project not found', HttpStatus.BAD_REQUEST);
    return await this.prisma.project.update({
      where: { uuid: id },
      data: {
        beneficiaries: {
          connect: beneficiaryId.map((id) => ({ uuid: id })),
        },
      },
    });
  }

  // Add new admin to the project
  async addAdmin(
    id: string,
    adminId: string,
    activeAddress: string,
  ): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: { uuid: id },
      select: { adminAddress: true, superAdmin: true }, // Only select the adminAddress field
    });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    if (project.superAdmin !== activeAddress) {
      throw new HttpException(
        'You are not authorized to add admin',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.project.update({
      where: { uuid: id },
      data: {
        adminAddress: {
          push: [adminId],
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

    return await this.prisma.project.update({
      where: { uuid: id },
      data: { isArchived },
    });
  }

  async ProjectbeneficiaryByAge(uuid: string): Promise<any> {
    const data = await this.prisma.project.findUnique({
      where: { uuid },
      select: {
        beneficiaries: {
          select: {
            age: true,
          },
        },
      },
    });
    return data;
  }
}
