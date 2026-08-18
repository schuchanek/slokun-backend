import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Venue } from './venue.entity';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Venue, { eager: true })
  venue: Venue;

  @CreateDateColumn()
  createdAt: Date;
}
