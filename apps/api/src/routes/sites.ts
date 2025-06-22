import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Site } from "db/entity/Site";

const router = Router();

// Get all sites
router.get("/", async (req: Request, res: Response) => {
  try {
    const siteRepository = AppDataSource.getRepository(Site);
    const sites = await siteRepository.find({
      order: { created_at: "DESC" }
    });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sites" });
  }
});

// Get site by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Site ID is required" });
    }
    const siteRepository = AppDataSource.getRepository(Site);
    const site = await siteRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["missions"]
    });
    
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch site" });
  }
});

// Create new site
router.post("/", async (req: Request, res: Response) => {
  try {
    const siteRepository = AppDataSource.getRepository(Site);
    const site = siteRepository.create(req.body);
    const result = await siteRepository.save(site);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create site" });
  }
});

// Update site
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Site ID is required" });
    }
    const siteRepository = AppDataSource.getRepository(Site);
    const site = await siteRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    
    siteRepository.merge(site, req.body);
    const result = await siteRepository.save(site);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update site" });
  }
});

// Delete site
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Site ID is required" });
    }
    const siteRepository = AppDataSource.getRepository(Site);
    const site = await siteRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    
    await siteRepository.remove(site);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete site" });
  }
});

export default router; 