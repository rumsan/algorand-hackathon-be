import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddAdminDto, AddBeneficiaryDto, UpdateProjectDto } from './dto/update-project.dto';
import { BENEFICIARY_STATUS } from '@prisma/client';

@Controller('projects')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/chart-age/:id')
  @ApiOperation({ summary: 'Get one project' })
  async ProjectBeneficiaryAge(@Param('id') id: string) {
    return this.projectService.ProjectBeneficiaryAgeChart(id);
  }
  @Get('/chart-gender/:id')
  @ApiOperation({ summary: 'Get one project' })
  async ProjectBeneficiaryGender(@Param('id') id: string) {
    return this.projectService.countGender(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Project' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  // find all projects
  @Get()
  @ApiOperation({ summary: 'List of all Project' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  async findAll(
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('name') name?: string,
  ) {
    return this.projectService.findAll(limit, page, { name });
  }

  // Find all beneficiary in a single project

  @Get(':id/beneficiaries')
  @ApiOperation({ summary: 'List of all beneficiary in a single project' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'id', required: false, type: String })
  async findAllBeneficiary(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: BENEFICIARY_STATUS,
  ) {
    return this.projectService.findAllBeneficiary(id, limit, page, status);
  }

  // find one project
  @Get(':id')
  @ApiOperation({ summary: 'Get one project' })
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  // update project
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  // Add  array of beneficiaries to the project
  @Patch(':id/addBeneficiaries')
  @ApiOperation({ summary: 'Add  array of beneficiaries to the project' })
  async addBeneficiary(
    @Param('id') id: string,
    @Body() addBeneficiaryDto: AddBeneficiaryDto,
  ) {
    return this.projectService.addBeneficiary(
      id,
      addBeneficiaryDto.beneficiaryIds,
    );
  }

  // Add new admin to the project
  @Post(':id/addAdmins')
  @ApiOperation({ summary: 'Add  array of admin to the project' })
  async addAdmin(@Param('id') id: string, @Body() addAdmindto: AddAdminDto) {
    const { adminIds,activeAddress } = addAdmindto;
    
    return this.projectService.addAdmin(id, adminIds,activeAddress);
  }

  // soft delete project by id
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Soft delete the project' })
  async remove(
    @Param('id') id: string,
    @Body('isArchived') isArchived: boolean,
  ) {
    return this.projectService.remove(id, isArchived);
  }
}
