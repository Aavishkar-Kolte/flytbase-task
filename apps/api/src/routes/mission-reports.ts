import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { MissionReport } from "db/entity/MissionReport";

const router = Router();

// Get all mission reports
router.get("/", async (req: Request, res: Response) => {
  try {
    const reportRepository = AppDataSource.getRepository(MissionReport);
    const reports = await reportRepository.find({
      relations: ["mission"],
      order: { generated_at: "DESC" }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission reports" });
  }
});

// Get mission report by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Report ID is required" });
    }
    const reportRepository = AppDataSource.getRepository(MissionReport);
    const report = await reportRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["mission"]
    });
    
    if (!report) {
      return res.status(404).json({ error: "Mission report not found" });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mission report" });
  }
});

// Create new mission report
router.post("/", async (req: Request, res: Response) => {
  try {
    const reportRepository = AppDataSource.getRepository(MissionReport);
    const report = reportRepository.create(req.body);
    const result = await reportRepository.save(report);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create mission report" });
  }
});

// Update mission report
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Report ID is required" });
    }
    const reportRepository = AppDataSource.getRepository(MissionReport);
    const report = await reportRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!report) {
      return res.status(404).json({ error: "Mission report not found" });
    }
    
    reportRepository.merge(report, req.body);
    const result = await reportRepository.save(report);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update mission report" });
  }
});

// Delete mission report
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Report ID is required" });
    }
    const reportRepository = AppDataSource.getRepository(MissionReport);
    const result = await reportRepository.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "Mission report not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete mission report" });
  }
});

export default router; 