import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaAppService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger('Auth Service');
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaAppService,
  ) {}

  async login(adminWalletAddress: any) {
    this._logger.log('Creating JWT Token for user');
    const admin = await this.prisma.project.findFirst({
      where: {
        superAdmin: adminWalletAddress,
      },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const payload = {
      walletAddress: admin?.superAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: +process.env.JWT_EXPIRATION_LONG_TIME,
      }),
    };
  }
  async validateUser(adminWalletAddress: string): Promise<any> {
    const admin = await this.prisma.project.findFirst({
      where: {
        superAdmin: adminWalletAddress,
      },
    });
    if (admin) {
      return admin;
    }
    throw new NotFoundException('User not found');
  }
}
