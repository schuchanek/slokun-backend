import { Controller, Post, Body, HttpCode, UseGuards, Req, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const existing = await this.users.findByEmail(body.email);
    if (existing) return { message: 'Email already registered' };
    const user = await this.users.createLocal(body.email, body.password);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) return { message: 'Invalid credentials' };
    return this.auth.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }
}
