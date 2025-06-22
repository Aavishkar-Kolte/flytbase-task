import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import type { Drone } from "./Drone.js";
import type { Mission } from "./Mission.js";

@Entity("drone_telemetry")
@Index("idx_drone_telemetry_time_drone", ["time", "drone_id"])
export class DroneTelemetry {
  @PrimaryColumn({ type: "timestamptz" })
  time!: Date;

  @PrimaryColumn({ type: "integer" })
  drone_id!: number;

  @Column({ type: "integer", nullable: true })
  mission_id?: number;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: "decimal", precision: 11, scale: 8 })
  longitude!: number;

  @Column({ type: "numeric", precision: 8, scale: 2 })
  altitude!: number;

  @Column({ type: "integer" })
  battery_level!: number;

  @Column({ type: "numeric", precision: 6, scale: 2 })
  speed!: number;

  @Column({ type: "integer" })
  signal_strength!: number;

  @Column({ type: "numeric", precision: 5, scale: 2 })
  temperature!: number;

  // Relations
  @ManyToOne('Drone', 'telemetry')
  @JoinColumn({ name: "drone_id" })
  drone!: Drone;

  @ManyToOne('Mission', undefined, { nullable: true })
  @JoinColumn({ name: "mission_id" })
  mission?: Mission;
} 