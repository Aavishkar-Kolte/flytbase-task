import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Organization } from "db/entity/Organization";

const router = Router();

// Get all organizations
router.get("/", async (req: Request, res: Response) => {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organizations = await organizationRepository.find({
      relations: ["users", "fleets", "sites", "missions"],
      order: { created_at: "DESC" }
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

// Get organization by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["users", "fleets", "sites", "missions"]
    });
    
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organization" });
  }
});

// Create new organization
router.post("/", async (req: Request, res: Response) => {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = organizationRepository.create(req.body);
    const result = await organizationRepository.save(organization);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create organization" });
  }
});

// Update organization
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    
    organizationRepository.merge(organization, req.body);
    const result = await organizationRepository.save(organization);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update organization" });
  }
});

// Delete organization
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const organizationRepository = AppDataSource.getRepository(Organization);
    const result = await organizationRepository.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete organization" });
  }
});

export default router; 