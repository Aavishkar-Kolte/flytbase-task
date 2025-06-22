import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import type { Mission } from "./Mission.js";
import type { Drone } from "./Drone.js";

@Entity("mission_progress")
@Index("idx_mission_progress_time_mission", ["time", "mission_id"])
export class MissionProgress {
  @PrimaryColumn({ type: "timestamptz" })
  time!: Date;

  @PrimaryColumn({ type: "integer" })
  mission_id!: number;

  @PrimaryColumn({ type: "integer" })
  drone_id!: number;

  @Column({ type: "integer" })
  progress_percentage!: number;

  @Column({ type: "integer" })
  waypoints_completed!: number;

  @Column({ type: "integer" })
  waypoints_total!: number;

  @Column({ type: "timestamptz", nullable: true })
  estimated_completion?: Date;

  @Column({ type: "varchar" })
  current_action!: string;

  // Relations
  @ManyToOne('Mission', 'progress')
  @JoinColumn({ name: "mission_id" })
  mission!: Mission;

  @ManyToOne('Drone', 'missionProgress')
  @JoinColumn({ name: "drone_id" })
  drone!: Drone;
} 