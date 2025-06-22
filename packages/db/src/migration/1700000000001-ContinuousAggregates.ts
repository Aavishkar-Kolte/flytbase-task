import { MigrationInterface, QueryRunner } from "typeorm";

export class ContinuousAggregates1700000000001 implements MigrationInterface {
    name = 'ContinuousAggregates1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create hourly drone stats continuous aggregate
        await queryRunner.query(`
            CREATE MATERIALIZED VIEW hourly_drone_stats
            WITH (timescaledb.continuous) AS
            SELECT
                time_bucket('1 hour', time) AS bucket,
                drone_id,
                AVG(battery_level) as avg_battery_level,
                MIN(battery_level) as min_battery_level,
                MAX(battery_level) as max_battery_level,
                AVG(speed) as avg_speed,
                MAX(speed) as max_speed,
                AVG(signal_strength) as avg_signal_strength,
                AVG(temperature) as avg_temperature,
                COUNT(*) as data_points,
                ST_Collect(ST_MakePoint(longitude, latitude)) as flight_path
            FROM drone_telemetry
            GROUP BY bucket, drone_id
            WITH NO DATA
        `);

        // Create daily mission summary continuous aggregate
        await queryRunner.query(`
            CREATE MATERIALIZED VIEW daily_mission_summary
            WITH (timescaledb.continuous) AS
            SELECT
                time_bucket('1 day', time) AS bucket,
                mission_id,
                drone_id,
                AVG(progress_percentage) as avg_progress,
                MAX(progress_percentage) as max_progress,
                MAX(waypoints_completed) as total_waypoints_completed,
                MAX(waypoints_total) as total_waypoints,
                COUNT(*) as progress_updates,
                AVG(EXTRACT(EPOCH FROM (estimated_completion - time))/3600) as avg_remaining_hours
            FROM mission_progress
            GROUP BY bucket, mission_id, drone_id
            WITH NO DATA
        `);

        // Create weekly fleet utilization continuous aggregate
        await queryRunner.query(`
            CREATE MATERIALIZED VIEW weekly_fleet_utilization
            WITH (timescaledb.continuous) AS
            SELECT
                time_bucket('1 week', dt.time) AS bucket,
                d.fleet_id,
                COUNT(DISTINCT dt.drone_id) as active_drones,
                COUNT(DISTINCT dt.mission_id) as active_missions,
                AVG(dt.battery_level) as avg_fleet_battery,
                AVG(dt.speed) as avg_fleet_speed,
                COUNT(*) as total_telemetry_points,
                SUM(CASE WHEN dt.battery_level < 20 THEN 1 ELSE 0 END) as low_battery_alerts
            FROM drone_telemetry dt
            JOIN drones d ON dt.drone_id = d.id
            GROUP BY bucket, d.fleet_id
            WITH NO DATA
        `);

        // Set up refresh policies for continuous aggregates
        await queryRunner.query(`SELECT add_continuous_aggregate_policy('hourly_drone_stats', start_offset => INTERVAL '3 hours', end_offset => INTERVAL '1 hour', schedule_interval => INTERVAL '1 hour')`);
        await queryRunner.query(`SELECT add_continuous_aggregate_policy('daily_mission_summary', start_offset => INTERVAL '3 days', end_offset => INTERVAL '1 day', schedule_interval => INTERVAL '1 day')`);
        await queryRunner.query(`SELECT add_continuous_aggregate_policy('weekly_fleet_utilization', start_offset => INTERVAL '3 weeks', end_offset => INTERVAL '1 week', schedule_interval => INTERVAL '1 week')`);

        // Create indexes on continuous aggregates for better query performance
        await queryRunner.query(`CREATE INDEX ON hourly_drone_stats (bucket DESC, drone_id)`);
        await queryRunner.query(`CREATE INDEX ON daily_mission_summary (bucket DESC, mission_id)`);
        await queryRunner.query(`CREATE INDEX ON weekly_fleet_utilization (bucket DESC, fleet_id)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop continuous aggregates
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS weekly_fleet_utilization CASCADE`);
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS daily_mission_summary CASCADE`);
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS hourly_drone_stats CASCADE`);
    }
} 