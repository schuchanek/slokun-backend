import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { id: req.user.id, email: req.user.email, role: req.user.role };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req: any, @Body() body: { email?: string }) {
    const repo = this.users.getRepo();
    const user = await this.users.findById(req.user.id);
    if (body.email) user.email = body.email;
    return repo.save(user);
  }
}
