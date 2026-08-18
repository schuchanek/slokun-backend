TypeORM migrations: use the npm scripts added in package.json:

- npm run migration:generate -- <Name>
- npm run migration:run

Migrations are located in src/migrations/ and referenced by src/data-source.ts
