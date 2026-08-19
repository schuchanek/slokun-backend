import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {}

  create(payload: Partial<Event>) {
    const e = this.repo.create(payload as any);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ relations: [] });
  }

  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException();
    return e;
  }

  async update(id: string, payload: Partial<Event>) {
    const e = await this.findById(id);
    Object.assign(e, payload);
    return this.repo.save(e);
  }

  async remove(id: string) {
    const e = await this.findById(id);
    return this.repo.remove(e);
  }
}
