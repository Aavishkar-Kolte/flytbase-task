import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Mission } from "./Mission.js";

@Entity("mission_reports")
export class MissionReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  mission_id!: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_distance!: number;

  @Column({ type: "integer" })
  actual_duration!: number;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  area_covered!: number;

  @Column({ type: "integer" })
  battery_consumed!: number;

  @Column({ type: "integer" })
  photos_taken!: number;

  @Column({ type: "integer" })
  videos_recorded!: number;

  @Column({ type: "text", nullable: true })
  issues_encountered?: string;

  @CreateDateColumn({ type: "timestamptz", name: "generated_at" })
  generated_at!: Date;

  // Relations
  @ManyToOne('Mission', 'reports')
  @JoinColumn({ name: "mission_id" })
  mission!: Mission;
} 