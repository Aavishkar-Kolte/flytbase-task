import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Mission } from "db/entity/Mission";
import { MissionProgress } from "db/entity/MissionProgress";

const router = Router();

// Get all missions
router.get("/", async (req: Request, res: Response) => {
  try {
    const missionRepository = AppDataSource.getRepository(Mission);
    const missions = await missionRepository.find({
      relations: ["organization", "site", "createdBy"],
      order: { created_at: "DESC" }
    });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch missions" });
  }
});

// Get mission by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    const missionRepository = AppDataSource.getRepository(Mission);
    const mission = await missionRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["organization", "site", "createdBy", "routes", "reports", "progress"]
    });
    
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission" });
  }
});

// Create new mission
router.post("/", async (req: Request, res: Response) => {
  try {
    const missionRepository = AppDataSource.getRepository(Mission);
    const mission = missionRepository.create(req.body);
    const result = await missionRepository.save(mission);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create mission" });
  }
});

// Update mission
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    const missionRepository = AppDataSource.getRepository(Mission);
    const mission = await missionRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    
    missionRepository.merge(mission, req.body);
    const result = await missionRepository.save(mission);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update mission" });
  }
});

// Delete mission
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    const missionRepository = AppDataSource.getRepository(Mission);
    const mission = await missionRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    
    await missionRepository.remove(mission);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete mission" });
  }
});

// Get mission progress
router.get("/:id/progress", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    const progressRepository = AppDataSource.getRepository(MissionProgress);
    const progress = await progressRepository.find({
      where: { mission_id: parseInt(req.params.id) },
      relations: ["drone"],
      order: { time: "DESC" }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission progress" });
  }
});

// Create mission progress
router.post("/:id/progress", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    const progressRepository = AppDataSource.getRepository(MissionProgress);
    const progress = progressRepository.create({
      ...req.body,
      mission_id: parseInt(req.params.id)
    });
    const result = await progressRepository.save(progress);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create mission progress" });
  }
});

export default router; 