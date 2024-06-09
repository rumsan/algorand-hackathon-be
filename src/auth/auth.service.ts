import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger('Auth Service');
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = {
      id: user.id,
      sub: {
        walletAddress: user.walletAddress,
      },
    };

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: +process.env.JWT_EXPIRATION_LONG_TIME,
      }),
    };
  }
}
