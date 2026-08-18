import { Controller, Post, Body, HttpCode, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  private success(data: any) { return { success: true, data }; }
  private error(code: string, message: string) { return { success: false, error: { code, message } }; }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const existing = await this.users.findByEmail(body.email);
    if (existing) return this.error('email_exists', 'Email already registered');
    const user = await this.users.createLocal(body.email, body.password);
    return this.success({ id: user.id, email: user.email });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) return this.error('invalid_credentials', 'Invalid credentials');
    const tokens = await this.auth.login(user);
    return this.success(tokens);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      const tokens = await this.auth.refresh(body.refreshToken);
      return this.success(tokens);
    } catch (e) {
      return this.error('invalid_token', 'Refresh token invalid');
    }
  }

  @Post('google')
  async google(@Body() body: { idToken: string }) {
    if (!body.idToken) return this.error('missing_token', 'idToken required');
    try {
      // validate idToken with Google
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${body.idToken}`);
      if (!res.ok) return this.error('invalid_token', 'Google token invalid');
      const info = await res.json();
      const email = info.email;
      const sub = info.sub;
      if (!email) return this.error('no_email', 'Google account has no email');
      const user = await this.users.findOrCreateSocial(email, 'google', sub);
      const tokens = await this.auth.login(user as any);
      return this.success(tokens);
    } catch (e) {
      return this.error('validation_failed', 'Google token validation failed');
    }
  }

  @Post('facebook')
  async facebook(@Body() body: { accessToken: string }) {
    if (!body.accessToken) return this.error('missing_token', 'accessToken required');
    try {
      const res = await fetch(`https://graph.facebook.com/me?fields=id,email&access_token=${body.accessToken}`);
      if (!res.ok) return this.error('invalid_token', 'Facebook token invalid');
      const info = await res.json();
      const email = info.email;
      const id = info.id;
      if (!email) return this.error('no_email', 'Facebook account has no email');
      const user = await this.users.findOrCreateSocial(email, 'facebook', id);
      const tokens = await this.auth.login(user as any);
      return this.success(tokens);
    } catch (e) {
      return this.error('validation_failed', 'Facebook token validation failed');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.success(req.user);
  }
}
