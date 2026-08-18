import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, plain: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.passwordHash) return null;
    const ok = await bcrypt.compare(plain, user.passwordHash);
    return ok ? user : null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign({ sub: user.id }, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.users.setRefreshTokenHash(user.id, refreshHash);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded: any = this.jwt.verify(refreshToken, { secret: process.env.JWT_SECRET || 'change_me' });
      const user = await this.users.findById(decoded.sub);
      if (!user || !user.refreshTokenHash) throw new UnauthorizedException();
      const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!ok) throw new UnauthorizedException();
      return this.login(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
