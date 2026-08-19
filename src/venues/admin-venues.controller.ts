import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin/venues')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminVenuesController {
  constructor(private vs: VenuesService) {}

  @Post()
  create(@Body() body: any) {
    return this.vs.create(body);
  }

  @Get()
  all() {
    return this.vs.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.vs.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.vs.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vs.remove(id);
  }

  @Get(':id/attendances')
  attendances(@Param('id') id: string) {
    return this.vs.listAttendances(id);
  }
}
