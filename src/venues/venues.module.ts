import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { AdminVenuesController } from './admin-venues.controller';
import { Venue } from '../entities/venue.entity';
import { Review } from '../entities/review.entity';
import { Attendance } from '../entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Review, Attendance])],
  providers: [VenuesService],
  controllers: [VenuesController, AdminVenuesController],
})
export class VenuesModule {}
