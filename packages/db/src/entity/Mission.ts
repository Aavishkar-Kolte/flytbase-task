import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import type { Organization } from "./Organization.js";
import type { Site } from "./Site.js";
import type { User } from "./User.js";
import type { Route } from "./Route.js";
import type { MissionReport } from "./MissionReport.js";
import type { MissionProgress } from "./MissionProgress.js";

@Entity("missions")
@Index("idx_missions_org_status_created", ["org_id", "status", "created_at"])
export class Mission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  org_id!: number;

  @Column({ type: "integer" })
  site_id!: number;

  @Column({ type: "integer" })
  created_by!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  mission_type!: "inspection" | "mapping" | "security";

  @Column({ type: "varchar" })
  pattern!: "crosshatch" | "perimeter" | "custom";

  @Column({ type: "integer" })
  overlap_percentage!: number;

  @Column({ type: "varchar", default: "planned" })
  status!: "planned" | "active" | "paused" | "completed" | "aborted";

  @Column({ type: "timestamptz", nullable: true })
  start_time?: Date;

  @Column({ type: "timestamptz", nullable: true })
  end_time?: Date;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Organization', 'missions')
  @JoinColumn({ name: "org_id" })
  organization!: Organization;

  @ManyToOne('Site', 'missions')
  @JoinColumn({ name: "site_id" })
  site!: Site;

  @ManyToOne('User', 'createdMissions')
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @OneToMany('Route', 'mission')
  routes!: Route[];

  @OneToMany('MissionReport', 'mission')
  reports!: MissionReport[];

  @OneToMany('MissionProgress', 'mission')
  progress!: MissionProgress[];
} 