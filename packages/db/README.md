# Database Package

This package contains the complete database schema for the drone management system using PostgreSQL with TimescaleDB and PostGIS extensions. Built with TypeScript, ES modules, and TypeORM.

## Features

- **TypeScript & ES Modules**: Modern development with full type safety
- **Relational Data**: Organizations, Users, Fleets, Drones, Sites, Missions, Routes, Waypoints, and Reports
- **Time-Series Data**: Drone telemetry and mission progress using TimescaleDB hypertables
- **Geospatial Data**: Site boundaries using PostGIS geometry
- **Continuous Aggregates**: Pre-computed analytics views for performance
- **Compression & Retention**: Automated data lifecycle management
- **Monorepo Ready**: Designed for use in Turborepo/monorepo setups

## Prerequisites

1. **PostgreSQL 12+** with TimescaleDB and PostGIS extensions
2. **Node.js 18+** and npm
3. **Environment variables** configured (see below)

## Environment Variables

Create a `.env` file in the `packages/db` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=drone_management
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript files:
```bash
npm run build
```

3. Test the database connection:
```bash
npm test
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run full database schema test |
| `npm run test:connection` | Test basic database connection |
| `npm run migration:generate` | Generate new migration |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run schema:sync` | Sync schema (development only) |
| `npm run schema:drop` | Drop all tables and data |

## Database Setup

### Option 1: Using Migrations (Recommended for Production)

1. Run the initial schema migration:
```bash
npm run migration:run
```

2. Run the continuous aggregates migration:
```bash
npm run migration:run
```

### Option 2: Using Schema Synchronization (Development Only)

```bash
npm run schema:sync
```

**Note**: Schema sync is disabled by default (`synchronize: false` in data-source.ts) to prevent accidental schema changes in production.

## Testing

### Full Schema Test
```bash
npm test
```

This comprehensive test verifies:
- ✅ Database connectivity
- ✅ Table existence (all 11 tables)
- ✅ TimescaleDB extensions (timescaledb, postgis, pgcrypto)
- ✅ Hypertable setup (drone_telemetry, mission_progress)
- ✅ Continuous aggregates (hourly_drone_stats, daily_mission_summary, weekly_fleet_utilization)

### Connection Test
```bash
npm run test:connection
```

Simple connection test that opens and closes the database connection.

## Usage in Other Packages

### Import in API/Frontend
```typescript
import { connectDB, AppDataSource } from '@repo/db';

// Connect to database
await connectDB();

// Use repositories
const userRepository = AppDataSource.getRepository(User);
const droneRepository = AppDataSource.getRepository(Drone);
```

### TypeScript Support
The package provides full TypeScript support with:
- Compiled JavaScript in `dist/`
- Type definitions in `dist/*.d.ts`
- ES module imports

## Schema Overview

### Relational Tables

1. **organizations** - Company/org management
2. **users** - User accounts with roles (admin, operator, viewer)
3. **fleets** - Drone fleet management
4. **drones** - Individual drone details with sensors
5. **sites** - Geographic locations with PostGIS boundaries
6. **missions** - Mission planning and execution
7. **routes** - Mission route assignments
8. **route_waypoints** - Detailed waypoint sequences
9. **mission_reports** - Mission completion reports

### TimescaleDB Hypertables

1. **drone_telemetry** - Real-time drone sensor data
   - Partitioned by time (1-day chunks)
   - Compressed after 1 day
   - Retention: 90 days full resolution

2. **mission_progress** - Mission execution tracking
   - Partitioned by time (1-hour chunks)
   - Compressed after 6 hours
   - Retention: 30 days full resolution

### Continuous Aggregates

1. **hourly_drone_stats** - Hourly drone performance metrics
2. **daily_mission_summary** - Daily mission completion statistics
3. **weekly_fleet_utilization** - Weekly fleet usage analytics

## Entity Structure

The package uses TypeORM entities with:
- **String-based relations**: Avoids circular dependency issues in ES modules
- **Type-only imports**: Prevents runtime circular dependencies
- **ES module syntax**: Modern import/export patterns

### Example Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Organization } from "./Organization.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne('Organization', 'users')
  @JoinColumn({ name: "org_id" })
  organization!: Organization;
}
```

## Indexing Strategy

### Standard Indexes
- `users(org_id, status)` - User filtering by organization
- `drones(fleet_id, status)` - Drone filtering by fleet
- `missions(org_id, status, created_at)` - Mission filtering and sorting
- `routes(mission_id, drone_id)` - Route lookups
- `sites(boundary_coordinates)` - Spatial queries

### Time-Series Indexes
- `drone_telemetry(time DESC, drone_id)` - Time-based queries
- `mission_progress(time DESC, mission_id)` - Progress tracking

## Data Lifecycle Management

### Compression Policies
- **drone_telemetry**: Compress after 1 day, segment by drone_id
- **mission_progress**: Compress after 6 hours, segment by mission_id

### Retention Policies
- **drone_telemetry**: 90 days full resolution → 1 year aggregated → archive
- **mission_progress**: 30 days full resolution → 180 days aggregated → delete

## Usage Examples

### Basic Connection
```typescript
import { AppDataSource, connectDB } from '@repo/db';

await connectDB();
const userRepository = AppDataSource.getRepository(User);
```

### Time-Series Queries
```sql
-- Get drone telemetry for last 24 hours
SELECT * FROM drone_telemetry 
WHERE time > NOW() - INTERVAL '24 hours' 
AND drone_id = 1;

-- Get mission progress
SELECT * FROM mission_progress 
WHERE mission_id = 1 
ORDER BY time DESC;
```

### Continuous Aggregate Queries
```sql
-- Get hourly drone stats
SELECT * FROM hourly_drone_stats 
WHERE bucket > NOW() - INTERVAL '7 days';

-- Get fleet utilization
SELECT * FROM weekly_fleet_utilization 
WHERE fleet_id = 1;
```

## Troubleshooting

### Common Issues

1. **TimescaleDB not installed**
   ```sql
   CREATE EXTENSION IF NOT EXISTS timescaledb;
   ```

2. **PostGIS not installed**
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

3. **Migration errors**
   - Check database permissions
   - Ensure extensions are installed
   - Verify environment variables

4. **Circular dependency errors**
   - The package uses string-based relations to avoid ES module circular dependencies
   - All entity imports are type-only imports

### Reset Database

To completely reset the database:
```bash
npm run schema:drop
npm run migration:run
```

**Note**: Schema drop may fail if TimescaleDB continuous aggregates exist. You may need to manually drop them:
```sql
DROP MATERIALIZED VIEW IF EXISTS hourly_drone_stats CASCADE;
DROP MATERIALIZED VIEW IF EXISTS daily_mission_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS weekly_fleet_utilization CASCADE;
```

## Development

### Generate New Migration
```bash
npm run migration:generate -- src/migration/MigrationName
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Development Workflow
1. Make changes to entities in `src/entity/`
2. Run `npm run build` to compile
3. Run `npm test` to verify changes
4. Generate migration if needed: `npm run migration:generate`
5. Test migration: `npm run migration:run`

## Performance Considerations

1. **Time-series queries** are optimized with TimescaleDB chunking
2. **Spatial queries** use PostGIS GiST indexes
3. **Continuous aggregates** provide pre-computed analytics
4. **Compression** reduces storage requirements by ~90%
5. **Retention policies** automatically manage data lifecycle
6. **ES modules** provide better tree-shaking and performance

## Package Structure

```
packages/db/
├── src/
│   ├── entity/           # TypeORM entities
│   ├── migration/        # Database migrations
│   ├── subscriber/       # TypeORM subscribers
│   ├── data-source.ts    # Database configuration
│   ├── index.ts          # Main exports
│   ├── test-connection.ts # Connection test
│   └── test-schema.ts    # Schema test
├── dist/                 # Compiled JavaScript
├── package.json          # Package configuration
└── tsconfig.json         # TypeScript configuration
``` 