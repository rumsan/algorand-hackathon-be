import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private prisma: PrismaAppService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.params.projectId;
    const walletAddress = request.params.walletAddress;

    // Fetch the project with the given projectId
    const project = await this.prisma.project.findUnique({
      where: {
        uuid: projectId,
      },
    });

    // Check if the project exists
    if (!project) {
      throw new ForbiddenException('Project not found.');
    }

    // Check if the walletAddress is either the superAdmin or in the adminAddress array
    const isSuperAdmin = project.superAdmin === walletAddress;
    const isAdmin = project.adminAddress.includes(walletAddress);

    if (!isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        "You are not authorized to access this project's data.",
      );
    }

    return true;
  }
}
