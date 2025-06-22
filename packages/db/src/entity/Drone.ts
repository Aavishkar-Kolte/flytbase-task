import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Fleet } from "./Fleet.js";
import type { Route } from "./Route.js";
import type { DroneTelemetry } from "./DroneTelemetry.js";
import type { MissionProgress } from "./MissionProgress.js";

@Entity("drones")
export class Drone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  fleet_id!: number;

  @Column({ type: "varchar" })
  model!: string;

  @Column({ type: "varchar", nullable: true })
  serial_number?: string;

  @Column({ type: "varchar", default: "available" })
  status!: "available" | "in-mission" | "maintenance" | "offline";

  @Column({ type: "integer" })
  data_frequency!: number;

  @Column({ type: "text", array: true })
  sensors!: string[];

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Fleet', 'drones')
  @JoinColumn({ name: "fleet_id" })
  fleet!: Fleet;

  @OneToMany('Route', 'drone')
  routes!: Route[];

  @OneToMany('DroneTelemetry', 'drone')
  telemetry!: DroneTelemetry[];

  @OneToMany('MissionProgress', 'drone')
  missionProgress!: MissionProgress[];
} 