import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Drone } from "db/entity/Drone";
import { DroneTelemetry } from "db/entity/DroneTelemetry";

const router = Router();

// Get all drones
router.get("/", async (req: Request, res: Response) => {
  try {
    const droneRepository = AppDataSource.getRepository(Drone);
    const drones = await droneRepository.find({
      relations: ["fleet"],
      order: { created_at: "DESC" }
    });
    res.json(drones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drones" });
  }
});

// Get drone by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Drone ID is required" });
    }
    const droneRepository = AppDataSource.getRepository(Drone);
    const drone = await droneRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["fleet", "telemetry", "missionProgress"]
    });
    
    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }
    
    res.json(drone);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drone" });
  }
});

// Create new drone
router.post("/", async (req: Request, res: Response) => {
  try {
    const droneRepository = AppDataSource.getRepository(Drone);
    const drone = droneRepository.create(req.body);
    const result = await droneRepository.save(drone);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create drone" });
  }
});

// Update drone
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Drone ID is required" });
    }
    const droneRepository = AppDataSource.getRepository(Drone);
    const drone = await droneRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }
    
    droneRepository.merge(drone, req.body);
    const result = await droneRepository.save(drone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update drone" });
  }
});

// Delete drone
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Drone ID is required" });
    }
    const droneRepository = AppDataSource.getRepository(Drone);
    const drone = await droneRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }
    
    await droneRepository.remove(drone);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete drone" });
  }
});

// Get drone telemetry
router.get("/:id/telemetry", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Drone ID is required" });
    }
    const telemetryRepository = AppDataSource.getRepository(DroneTelemetry);
    const telemetry = await telemetryRepository.find({
      where: { drone_id: parseInt(req.params.id) },
      order: { time: "DESC" },
      take: parseInt(req.query.limit as string) || 100
    });
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch telemetry" });
  }
});

// Create drone telemetry
router.post("/:id/telemetry", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Drone ID is required" });
    }
    const telemetryRepository = AppDataSource.getRepository(DroneTelemetry);
    const telemetry = telemetryRepository.create({
      ...req.body,
      drone_id: parseInt(req.params.id)
    });
    const result = await telemetryRepository.save(telemetry);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create telemetry" });
  }
});

export default router; 