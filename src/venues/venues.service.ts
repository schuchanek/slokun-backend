import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venue } from '../entities/venue.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class VenuesService {
  constructor(@InjectRepository(Venue) private repo: Repository<Venue>, private dataSource: DataSource) {}

  findAll() {
    return this.repo.find();
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 5) {
    // Use PostGIS ST_DWithin on geography column
    const meters = radiusKm * 1000;
    const sql = `SELECT *, ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance_m FROM venues WHERE location IS NOT NULL AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3) ORDER BY distance_m ASC LIMIT 100`;
    const raw = await this.dataSource.query(sql, [lng, lat, meters]);
    return raw;
  }

  async findById(id: string) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException();
    return v;
  }

  async addReview(venueId: string, review: Partial<Review>) {
    const venue = await this.findById(venueId);
    const r = this.repo.manager.getRepository(Review).create({ ...review, venue });
    return this.repo.manager.getRepository(Review).save(r);
  }

  async attend(venueId: string, userId: string) {
    // simple attendance stub: in real app create attendance table
    const v = await this.findById(venueId);
    return { message: `User ${userId} will attend ${v.id}` };
  }
}
