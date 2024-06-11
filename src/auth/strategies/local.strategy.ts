import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'otp' });
  }

  async validate(adminAddress: string): Promise<any> {
    const user = await this.authService.validateUser(adminAddress);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
