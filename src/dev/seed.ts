import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Venue } from '../entities/venue.entity';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'slokun_dev',
    entities: [User, Venue],
  });
  await ds.initialize();

  const uRepo = ds.getRepository(User);
  const vRepo = ds.getRepository(Venue);

  const pw = await bcrypt.hash('password', 10);
  let u = uRepo.create({ email: 'test@example.com', passwordHash: pw });
  u = await uRepo.save(u);

  const venues = [
    { name: 'Central Sauna', address: 'Main St 1', location: `SRID=4326;POINT(19.040236 47.497913)` },
    { name: 'Riverside Sauna', address: 'River Rd', location: `SRID=4326;POINT(19.045236 47.502913)` },
    { name: 'Hillside Sauna', address: 'Hill Ln', location: `SRID=4326;POINT(19.033236 47.492913)` },
  ];
  for (const v of venues) {
    const ve = vRepo.create(v as any);
    await vRepo.save(ve);
  }

  await ds.destroy();
  console.log('Seed complete');
}

seed().catch((e) => console.error(e));
