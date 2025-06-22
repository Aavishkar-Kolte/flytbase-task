import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Fleet } from "db/entity/Fleet";

const router = Router();

// Get all fleets
router.get("/", async (req: Request, res: Response) => {
  try {
    const fleetRepository = AppDataSource.getRepository(Fleet);
    const fleets = await fleetRepository.find({
      relations: ["drones"],
      order: { created_at: "DESC" }
    });
    res.json(fleets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fleets" });
  }
});

// Get fleet by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Fleet ID is required" });
    }
    const fleetRepository = AppDataSource.getRepository(Fleet);
    const fleet = await fleetRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["drones"]
    });
    
    if (!fleet) {
      return res.status(404).json({ error: "Fleet not found" });
    }
    
    res.json(fleet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fleet" });
  }
});

// Create new fleet
router.post("/", async (req: Request, res: Response) => {
  try {
    const fleetRepository = AppDataSource.getRepository(Fleet);
    const fleet = fleetRepository.create(req.body);
    const result = await fleetRepository.save(fleet);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create fleet" });
  }
});

// Update fleet
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Fleet ID is required" });
    }
    const fleetRepository = AppDataSource.getRepository(Fleet);
    const fleet = await fleetRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!fleet) {
      return res.status(404).json({ error: "Fleet not found" });
    }
    
    fleetRepository.merge(fleet, req.body);
    const result = await fleetRepository.save(fleet);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update fleet" });
  }
});

// Delete fleet
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Fleet ID is required" });
    }
    const fleetRepository = AppDataSource.getRepository(Fleet);
    const fleet = await fleetRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!fleet) {
      return res.status(404).json({ error: "Fleet not found" });
    }
    
    await fleetRepository.remove(fleet);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete fleet" });
  }
});

export default router; 