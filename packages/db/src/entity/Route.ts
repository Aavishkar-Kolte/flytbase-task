import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { Mission } from "./Mission.js";
import { Drone } from "./Drone.js";
import { RouteWaypoint } from "./RouteWaypoint.js";

@Entity("routes")
@Index("idx_routes_mission_drone", ["mission_id", "drone_id"])
export class Route {
  @PrimaryGeneratedColumn({ name: "route_id" })
  route_id!: number;

  @Column({ type: "integer" })
  mission_id!: number;

  @Column({ type: "integer" })
  drone_id!: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne(() => Mission, mission => mission.routes)
  @JoinColumn({ name: "mission_id" })
  mission!: Mission;

  @ManyToOne(() => Drone, drone => drone.routes)
  @JoinColumn({ name: "drone_id" })
  drone!: Drone;

  @OneToMany(() => RouteWaypoint, waypoint => waypoint.route)
  waypoints!: RouteWaypoint[];
} 