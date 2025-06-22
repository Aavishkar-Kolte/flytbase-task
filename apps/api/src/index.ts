import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "db";

// Import routes
import droneRoutes from "./routes/drones.js";
import missionRoutes from "./routes/missions.js";
import fleetRoutes from "./routes/fleets.js";
import siteRoutes from "./routes/sites.js";
import statsRoutes from "./routes/stats.js";
import userRoutes from "./routes/users.js";
import organizationRoutes from "./routes/organizations.js";
import routeRoutes from "./routes/routes.js";
import droneTelemetryRoutes from "./routes/drone-telemetry.js";
import missionProgressRoutes from "./routes/mission-progress.js";
import missionReportRoutes from "./routes/mission-reports.js";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/drones", droneRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/fleets", fleetRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/drone-telemetry", droneTelemetryRoutes);
app.use("/api/mission-progress", missionProgressRoutes);
app.use("/api/mission-reports", missionReportRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 API server running at http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`📋 Available endpoints:`);
      console.log(`   GET  /api/drones - List all drones`);
      console.log(`   POST /api/drones - Create a new drone`);
      console.log(`   GET  /api/missions - List all missions`);
      console.log(`   POST /api/missions - Create a new mission`);
      console.log(`   GET  /api/fleets - List all fleets`);
      console.log(`   GET  /api/sites - List all sites`);
      console.log(`   GET  /api/stats/drones - Drone statistics`);
      console.log(`   GET  /api/stats/missions - Mission statistics`);
      console.log(`   GET  /api/users - List all users`);
      console.log(`   GET  /api/organizations - List all organizations`);
      console.log(`   GET  /api/routes - List all routes`);
      console.log(`   GET  /api/drone-telemetry - List all drone telemetry`);
      console.log(`   GET  /api/mission-progress - List all mission progress`);
      console.log(`   GET  /api/mission-reports - List all mission reports`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer(); 