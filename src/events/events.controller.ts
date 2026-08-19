import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EventsController {
  constructor(private es: EventsService) {}

  @Post()
  create(@Body() body: any) { return this.es.create(body); }

  @Get()
  all() { return this.es.findAll(); }

  @Get(':id')
  byId(@Param('id') id: string) { return this.es.findById(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.es.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.es.remove(id); }
}
