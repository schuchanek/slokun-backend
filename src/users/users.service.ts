import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // expose repo for simple controller updates
  getRepo() { return this.repo; }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async createLocal(email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = this.repo.create({ email, passwordHash: hash });
    return this.repo.save(user);
  }

  async setRefreshTokenHash(userId: string, tokenHash: string) {
    await this.repo.update(userId, { refreshTokenHash: tokenHash });
  }

  async findOrCreateSocial(email: string, provider: 'google' | 'facebook', providerId: string) {
    let user = await this.repo.findOne({ where: [{ email }, { googleId: provider === 'google' ? providerId : undefined }, { facebookId: provider === 'facebook' ? providerId : undefined }] });
    if (!user) {
      user = this.repo.create({ email, ...(provider === 'google' ? { googleId: providerId } : { facebookId: providerId }) });
      user = await this.repo.save(user);
    }
    return user;
  }
}
