import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Drone } from "db/entity/Drone";
import { Mission } from "db/entity/Mission";

const router = Router();

// Get drone statistics
router.get("/drones", async (req: Request, res: Response) => {
  try {
    const droneRepository = AppDataSource.getRepository(Drone);
    const stats = await droneRepository
      .createQueryBuilder("drone")
      .select("drone.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("drone.status")
      .getRawMany();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drone statistics" });
  }
});

// Get mission statistics
router.get("/missions", async (req: Request, res: Response) => {
  try {
    const missionRepository = AppDataSource.getRepository(Mission);
    const stats = await missionRepository
      .createQueryBuilder("mission")
      .select("mission.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("mission.status")
      .getRawMany();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission statistics" });
  }
});

export default router; 