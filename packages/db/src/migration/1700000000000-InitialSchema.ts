import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable required extensions
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "timescaledb"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        // Create organizations table
        await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_organizations_name" UNIQUE ("name"),
                CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "google_id" character varying,
                "email" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" character varying NOT NULL,
                "is_root" boolean NOT NULL DEFAULT false,
                "org_id" integer NOT NULL,
                "status" character varying NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_google_id" UNIQUE ("google_id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Create fleets table
        await queryRunner.query(`
            CREATE TABLE "fleets" (
                "id" SERIAL NOT NULL,
                "org_id" integer NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fleets" PRIMARY KEY ("id")
            )
        `);

        // Create drones table
        await queryRunner.query(`
            CREATE TABLE "drones" (
                "id" SERIAL NOT NULL,
                "fleet_id" integer NOT NULL,
                "model" character varying NOT NULL,
                "serial_number" character varying,
                "status" character varying NOT NULL DEFAULT 'available',
                "data_frequency" integer NOT NULL,
                "sensors" text[] NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_drones" PRIMARY KEY ("id")
            )
        `);

        // Create sites table with PostGIS geometry
        await queryRunner.query(`
            CREATE TABLE "sites" (
                "id" SERIAL NOT NULL,
                "org_id" integer NOT NULL,
                "name" character varying NOT NULL,
                "address" text NOT NULL,
                "boundary_coordinates" geometry(Polygon,4326) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_sites" PRIMARY KEY ("id")
            )
        `);

        // Create missions table
        await queryRunner.query(`
            CREATE TABLE "missions" (
                "id" SERIAL NOT NULL,
                "org_id" integer NOT NULL,
                "site_id" integer NOT NULL,
                "created_by" integer NOT NULL,
                "name" character varying NOT NULL,
                "mission_type" character varying NOT NULL,
                "pattern" character varying NOT NULL,
                "overlap_percentage" integer NOT NULL,
                "status" character varying NOT NULL DEFAULT 'planned',
                "start_time" TIMESTAMP,
                "end_time" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_missions" PRIMARY KEY ("id")
            )
        `);

        // Create routes table
        await queryRunner.query(`
            CREATE TABLE "routes" (
                "route_id" SERIAL NOT NULL,
                "mission_id" integer NOT NULL,
                "drone_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_routes" PRIMARY KEY ("route_id")
            )
        `);

        // Create route_waypoints table
        await queryRunner.query(`
            CREATE TABLE "route_waypoints" (
                "id" SERIAL NOT NULL,
                "route_id" integer NOT NULL,
                "seq" integer NOT NULL,
                "latitude" decimal(10,8) NOT NULL,
                "longitude" decimal(11,8) NOT NULL,
                "altitude" numeric(8,2) NOT NULL,
                "action" character varying NOT NULL,
                "duration" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_route_waypoints" PRIMARY KEY ("id")
            )
        `);

        // Create mission_reports table
        await queryRunner.query(`
            CREATE TABLE "mission_reports" (
                "id" SERIAL NOT NULL,
                "mission_id" integer NOT NULL,
                "total_distance" numeric(10,2) NOT NULL,
                "actual_duration" integer NOT NULL,
                "area_covered" numeric(12,2) NOT NULL,
                "battery_consumed" integer NOT NULL,
                "photos_taken" integer NOT NULL,
                "videos_recorded" integer NOT NULL,
                "issues_encountered" text,
                "generated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_mission_reports" PRIMARY KEY ("id")
            )
        `);

        // Create drone_telemetry hypertable
        await queryRunner.query(`
            CREATE TABLE "drone_telemetry" (
                "time" TIMESTAMP NOT NULL,
                "drone_id" integer NOT NULL,
                "mission_id" integer,
                "latitude" decimal(10,8) NOT NULL,
                "longitude" decimal(11,8) NOT NULL,
                "altitude" numeric(8,2) NOT NULL,
                "battery_level" integer NOT NULL,
                "speed" numeric(6,2) NOT NULL,
                "signal_strength" integer NOT NULL,
                "temperature" numeric(5,2) NOT NULL,
                CONSTRAINT "PK_drone_telemetry" PRIMARY KEY ("time", "drone_id")
            )
        `);

        // Create mission_progress hypertable
        await queryRunner.query(`
            CREATE TABLE "mission_progress" (
                "time" TIMESTAMP NOT NULL,
                "mission_id" integer NOT NULL,
                "drone_id" integer NOT NULL,
                "progress_percentage" integer NOT NULL,
                "waypoints_completed" integer NOT NULL,
                "waypoints_total" integer NOT NULL,
                "estimated_completion" TIMESTAMP,
                "current_action" character varying NOT NULL,
                CONSTRAINT "PK_mission_progress" PRIMARY KEY ("time", "mission_id", "drone_id")
            )
        `);

        // Convert to TimescaleDB hypertables
        await queryRunner.query(`SELECT create_hypertable('drone_telemetry', 'time', chunk_time_interval => INTERVAL '1 day')`);
        await queryRunner.query(`SELECT create_hypertable('mission_progress', 'time', chunk_time_interval => INTERVAL '1 hour')`);

        // Add foreign key constraints
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_org_id" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fleets" ADD CONSTRAINT "FK_fleets_org_id" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drones" ADD CONSTRAINT "FK_drones_fleet_id" FOREIGN KEY ("fleet_id") REFERENCES "fleets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "FK_sites_org_id" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "missions" ADD CONSTRAINT "FK_missions_org_id" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "missions" ADD CONSTRAINT "FK_missions_site_id" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "missions" ADD CONSTRAINT "FK_missions_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_routes_mission_id" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_routes_drone_id" FOREIGN KEY ("drone_id") REFERENCES "drones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route_waypoints" ADD CONSTRAINT "FK_route_waypoints_route_id" FOREIGN KEY ("route_id") REFERENCES "routes"("route_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_reports" ADD CONSTRAINT "FK_mission_reports_mission_id" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drone_telemetry" ADD CONSTRAINT "FK_drone_telemetry_drone_id" FOREIGN KEY ("drone_id") REFERENCES "drones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drone_telemetry" ADD CONSTRAINT "FK_drone_telemetry_mission_id" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_progress" ADD CONSTRAINT "FK_mission_progress_mission_id" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_progress" ADD CONSTRAINT "FK_mission_progress_drone_id" FOREIGN KEY ("drone_id") REFERENCES "drones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "idx_users_org_status" ON "users" ("org_id", "status")`);
        await queryRunner.query(`CREATE INDEX "idx_drones_fleet_status" ON "drones" ("fleet_id", "status")`);
        await queryRunner.query(`CREATE INDEX "idx_missions_org_status_created" ON "missions" ("org_id", "status", "created_at")`);
        await queryRunner.query(`CREATE INDEX "idx_routes_mission_drone" ON "routes" ("mission_id", "drone_id")`);
        await queryRunner.query(`CREATE INDEX "idx_sites_boundary_coordinates" ON "sites" USING GIST ("boundary_coordinates")`);
        await queryRunner.query(`CREATE INDEX "idx_drone_telemetry_time_drone" ON "drone_telemetry" ("time" DESC, "drone_id")`);
        await queryRunner.query(`CREATE INDEX "idx_mission_progress_time_mission" ON "mission_progress" ("time" DESC, "mission_id")`);

        // Set up TimescaleDB compression policies
        await queryRunner.query(`ALTER TABLE drone_telemetry SET (timescaledb.compress, timescaledb.compress_segmentby = 'drone_id')`);
        await queryRunner.query(`SELECT add_compression_policy('drone_telemetry', INTERVAL '1 day')`);

        await queryRunner.query(`ALTER TABLE mission_progress SET (timescaledb.compress, timescaledb.compress_segmentby = 'mission_id')`);
        await queryRunner.query(`SELECT add_compression_policy('mission_progress', INTERVAL '6 hours')`);

        // Set up retention policies
        await queryRunner.query(`SELECT add_retention_policy('drone_telemetry', INTERVAL '90 days')`);
        await queryRunner.query(`SELECT add_retention_policy('mission_progress', INTERVAL '30 days')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "mission_progress" DROP CONSTRAINT "FK_mission_progress_drone_id"`);
        await queryRunner.query(`ALTER TABLE "mission_progress" DROP CONSTRAINT "FK_mission_progress_mission_id"`);
        await queryRunner.query(`ALTER TABLE "drone_telemetry" DROP CONSTRAINT "FK_drone_telemetry_mission_id"`);
        await queryRunner.query(`ALTER TABLE "drone_telemetry" DROP CONSTRAINT "FK_drone_telemetry_drone_id"`);
        await queryRunner.query(`ALTER TABLE "mission_reports" DROP CONSTRAINT "FK_mission_reports_mission_id"`);
        await queryRunner.query(`ALTER TABLE "route_waypoints" DROP CONSTRAINT "FK_route_waypoints_route_id"`);
        await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_routes_drone_id"`);
        await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_routes_mission_id"`);
        await queryRunner.query(`ALTER TABLE "missions" DROP CONSTRAINT "FK_missions_created_by"`);
        await queryRunner.query(`ALTER TABLE "missions" DROP CONSTRAINT "FK_missions_site_id"`);
        await queryRunner.query(`ALTER TABLE "missions" DROP CONSTRAINT "FK_missions_org_id"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT "FK_sites_org_id"`);
        await queryRunner.query(`ALTER TABLE "drones" DROP CONSTRAINT "FK_drones_fleet_id"`);
        await queryRunner.query(`ALTER TABLE "fleets" DROP CONSTRAINT "FK_fleets_org_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_org_id"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "mission_progress"`);
        await queryRunner.query(`DROP TABLE "drone_telemetry"`);
        await queryRunner.query(`DROP TABLE "mission_reports"`);
        await queryRunner.query(`DROP TABLE "route_waypoints"`);
        await queryRunner.query(`DROP TABLE "routes"`);
        await queryRunner.query(`DROP TABLE "missions"`);
        await queryRunner.query(`DROP TABLE "sites"`);
        await queryRunner.query(`DROP TABLE "drones"`);
        await queryRunner.query(`DROP TABLE "fleets"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }
} 