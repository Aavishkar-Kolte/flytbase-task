import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Route } from "./Route.js";

@Entity("route_waypoints")
export class RouteWaypoint {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  route_id!: number;

  @Column({ type: "integer" })
  seq!: number;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: "decimal", precision: 11, scale: 8 })
  longitude!: number;

  @Column({ type: "numeric", precision: 8, scale: 2 })
  altitude!: number;

  @Column({ type: "varchar" })
  action!: "photo" | "video" | "hover" | "turn";

  @Column({ type: "integer" })
  duration!: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Route', 'waypoints')
  @JoinColumn({ name: "route_id" })
  route!: Route;
} 