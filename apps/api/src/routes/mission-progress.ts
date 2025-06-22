import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { MissionProgress } from "db/entity/MissionProgress";
import { FindManyOptions, Between } from "typeorm";

const router = Router();

// Get all mission progress with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const progressRepository = AppDataSource.getRepository(MissionProgress);
    
    const { mission_id, drone_id, start_time, end_time } = req.query;

    const where: FindManyOptions<MissionProgress>['where'] = {};

    if (mission_id) {
        where.mission_id = parseInt(mission_id as string);
    }
    if (drone_id) {
        where.drone_id = parseInt(drone_id as string);
    }
    if (start_time && end_time) {
        where.time = Between(new Date(start_time as string), new Date(end_time as string));
    }

    const progress = await progressRepository.find({
      where,
      relations: ["mission", "drone"],
      order: { time: "DESC" },
      take: 1000 // Limit to 1000 records for performance
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission progress" });
  }
});

// Create new mission progress
router.post("/", async (req: Request, res: Response) => {
  try {
    const progressRepository = AppDataSource.getRepository(MissionProgress);
    const progress = progressRepository.create(req.body);
    const result = await progressRepository.save(progress);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create mission progress" });
  }
});

// Delete mission progress
router.delete("/", async (req: Request, res: Response) => {
    try {
        const { mission_id, drone_id, time } = req.query;

        if (!mission_id || !drone_id || !time) {
            return res.status(400).json({ error: "mission_id, drone_id and time are required query parameters" });
        }

        const progressRepository = AppDataSource.getRepository(MissionProgress);
        const result = await progressRepository.delete({
            mission_id: parseInt(mission_id as string),
            drone_id: parseInt(drone_id as string),
            time: new Date(time as string)
        });

        if (result.affected === 0) {
            return res.status(404).json({ error: "Mission progress entry not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete mission progress" });
    }
});


export default router; 