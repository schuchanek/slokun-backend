import { Controller, Get, Query, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('venues')
export class VenuesController {
  constructor(private vs: VenuesService) {}

  @Get()
  all() {
    return this.vs.findAll();
  }

  @Get('nearby')
  nearby(@Query('lat') lat: string, @Query('lng') lng: string, @Query('radius') radius: string) {
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    const r = radius ? parseFloat(radius) : 5;
    return this.vs.findNearby(la, ln, r);
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.vs.findById(id);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  addReview(@Param('id') id: string, @Body() body: { rating: number; comment?: string }, @Req() req: any) {
    return this.vs.addReview(id, { rating: body.rating, comment: body.comment, user: { id: req.user.id } as any });
  }

  @Post(':id/attendance')
  @UseGuards(JwtAuthGuard)
  attend(@Param('id') id: string, @Req() req: any) {
    return this.vs.attend(id, req.user.id);
  }
}
