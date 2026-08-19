import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VenuesModule } from './venues/venues.module';
import { Review } from './entities/review.entity';
import { User } from './entities/user.entity';
import { Venue } from './entities/venue.entity';
import { Event } from './entities/event.entity';
import { Attendance } from './entities/attendance.entity';
import { MobileProvider } from './entities/mobile-provider.entity';
import { HealthController } from './common/health.controller';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'db',
        port: +(process.env.POSTGRES_PORT || 5432),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'slokun_dev',
        entities: [User, Venue, Review, Event, Attendance, MobileProvider],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    UsersModule,
    AuthModule,
    VenuesModule,
    EventsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
