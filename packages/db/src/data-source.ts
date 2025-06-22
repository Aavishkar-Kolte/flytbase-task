import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Import entities individually to avoid circular dependency issues
import { Organization } from "./entity/Organization.js";
import { User } from "./entity/User.js";
import { Fleet } from "./entity/Fleet.js";
import { Drone } from "./entity/Drone.js";
import { Site } from "./entity/Site.js";
import { Mission } from "./entity/Mission.js";
import { Route } from "./entity/Route.js";
import { RouteWaypoint } from "./entity/RouteWaypoint.js";
import { MissionReport } from "./entity/MissionReport.js";
import { DroneTelemetry } from "./entity/DroneTelemetry.js";
import { MissionProgress } from "./entity/MissionProgress.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    Organization,
    User,
    Fleet,
    Drone,
    Site,
    Mission,
    Route,
    RouteWaypoint,
    MissionReport,
    DroneTelemetry,
    MissionProgress
  ],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  extra: {
    // Enable TimescaleDB and PostGIS extensions
    extensions: ["timescaledb", "postgis", "pgcrypto"]
  }
}); 