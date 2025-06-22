import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { User } from "db/entity/User";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: ["organization"],
      order: { created_at: "DESC" }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["organization", "createdMissions"]
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Update user
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" });
  }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router; 