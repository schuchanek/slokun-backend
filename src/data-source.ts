import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Venue } from './entities/venue.entity';
import { Review } from './entities/review.entity';
import { Event } from './entities/event.entity';
import { Attendance } from './entities/attendance.entity';
import { MobileProvider } from './entities/mobile-provider.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'slokun_dev',
  entities: [User, Venue, Review, Event, Attendance, MobileProvider],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});

export default AppDataSource;
