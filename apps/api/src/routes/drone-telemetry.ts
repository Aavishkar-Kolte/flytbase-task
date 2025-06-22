import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { DroneTelemetry } from "db/entity/DroneTelemetry";
import { FindManyOptions, Between } from "typeorm";

const router = Router();

// Get all drone telemetry with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const telemetryRepository = AppDataSource.getRepository(DroneTelemetry);
    
    const { drone_id, mission_id, start_time, end_time } = req.query;

    const where: FindManyOptions<DroneTelemetry>['where'] = {};

    if (drone_id) {
        where.drone_id = parseInt(drone_id as string);
    }
    if (mission_id) {
        where.mission_id = parseInt(mission_id as string);
    }
    if (start_time && end_time) {
        where.time = Between(new Date(start_time as string), new Date(end_time as string));
    }

    const telemetry = await telemetryRepository.find({
      where,
      relations: ["drone", "mission"],
      order: { time: "DESC" },
      take: 1000 // Limit to 1000 records for performance
    });
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch telemetry" });
  }
});

// Create new drone telemetry
router.post("/", async (req: Request, res: Response) => {
  try {
    const telemetryRepository = AppDataSource.getRepository(DroneTelemetry);
    const telemetry = telemetryRepository.create(req.body);
    const result = await telemetryRepository.save(telemetry);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create telemetry" });
  }
});

// Delete drone telemetry
router.delete("/", async (req: Request, res: Response) => {
    try {
        const { drone_id, time } = req.query;

        if (!drone_id || !time) {
            return res.status(400).json({ error: "drone_id and time are required query parameters" });
        }

        const telemetryRepository = AppDataSource.getRepository(DroneTelemetry);
        const result = await telemetryRepository.delete({
            drone_id: parseInt(drone_id as string),
            time: new Date(time as string)
        });

        if (result.affected === 0) {
            return res.status(404).json({ error: "Telemetry entry not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete telemetry" });
    }
});


export default router; 