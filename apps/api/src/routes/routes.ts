import { Router, Request, Response } from "express";
import { AppDataSource } from "db";
import { Route } from "db/entity/Route";
import { RouteWaypoint } from "db/entity/RouteWaypoint";

const router = Router();

// Get all routes
router.get("/", async (req: Request, res: Response) => {
  try {
    const routeRepository = AppDataSource.getRepository(Route);
    const routes = await routeRepository.find({
      relations: ["mission", "drone", "waypoints"],
      order: { created_at: "DESC" }
    });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// Get route by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Route ID is required" });
    }
    const routeRepository = AppDataSource.getRepository(Route);
    const route = await routeRepository.findOne({
      where: { route_id: parseInt(req.params.id) },
      relations: ["mission", "drone", "waypoints"]
    });
    
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

// Create new route
router.post("/", async (req: Request, res: Response) => {
  try {
    const routeRepository = AppDataSource.getRepository(Route);
    const route = routeRepository.create(req.body);
    const result = await routeRepository.save(route);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create route" });
  }
});

// Update route
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Route ID is required" });
    }
    const routeRepository = AppDataSource.getRepository(Route);
    const route = await routeRepository.findOne({
      where: { route_id: parseInt(req.params.id) }
    });
    
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    
    routeRepository.merge(route, req.body);
    const result = await routeRepository.save(route);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update route" });
  }
});

// Delete route
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Route ID is required" });
    }
    const routeRepository = AppDataSource.getRepository(Route);
    const result = await routeRepository.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "Route not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete route" });
  }
});

// --- Route Waypoints ---

// Get all waypoints for a route
router.get("/:id/waypoints", async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "Route ID is required" });
        }
        const waypointRepository = AppDataSource.getRepository(RouteWaypoint);
        const waypoints = await waypointRepository.find({
            where: { route_id: parseInt(req.params.id) },
            order: { seq: "ASC" }
        });
        res.json(waypoints);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch waypoints" });
    }
});

// Create a new waypoint for a route
router.post("/:id/waypoints", async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "Route ID is required" });
        }
        const waypointRepository = AppDataSource.getRepository(RouteWaypoint);
        const waypoint = waypointRepository.create({
            ...req.body,
            route_id: parseInt(req.params.id)
        });
        const result = await waypointRepository.save(waypoint);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: "Failed to create waypoint" });
    }
});

// Get a specific waypoint
router.get("/:id/waypoints/:wpId", async (req: Request, res: Response) => {
    try {
        if (!req.params.wpId) {
            return res.status(400).json({ error: "Waypoint ID is required" });
        }
        const waypointRepository = AppDataSource.getRepository(RouteWaypoint);
        const waypoint = await waypointRepository.findOne({
            where: { id: parseInt(req.params.wpId) }
        });
        if (!waypoint) {
            return res.status(404).json({ error: "Waypoint not found" });
        }
        res.json(waypoint);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch waypoint" });
    }
});

// Update a waypoint
router.put("/:id/waypoints/:wpId", async (req: Request, res: Response) => {
    try {
        if (!req.params.wpId) {
            return res.status(400).json({ error: "Waypoint ID is required" });
        }
        const waypointRepository = AppDataSource.getRepository(RouteWaypoint);
        const waypoint = await waypointRepository.findOne({
            where: { id: parseInt(req.params.wpId) }
        });

        if (!waypoint) {
            return res.status(404).json({ error: "Waypoint not found" });
        }

        waypointRepository.merge(waypoint, req.body);
        const result = await waypointRepository.save(waypoint);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: "Failed to update waypoint" });
    }
});

// Delete a waypoint
router.delete("/:id/waypoints/:wpId", async (req: Request, res: Response) => {
    try {
        if (!req.params.wpId) {
            return res.status(400).json({ error: "Waypoint ID is required" });
        }
        const waypointRepository = AppDataSource.getRepository(RouteWaypoint);
        const result = await waypointRepository.delete(parseInt(req.params.wpId));

        if (result.affected === 0) {
            return res.status(404).json({ error: "Waypoint not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete waypoint" });
    }
});


export default router; 