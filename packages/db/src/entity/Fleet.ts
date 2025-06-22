import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Organization } from "./Organization.js";
import type { Drone } from "./Drone.js";

@Entity("fleets")
export class Fleet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  org_id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Organization', 'fleets')
  @JoinColumn({ name: "org_id" })
  organization!: Organization;

  @OneToMany('Drone', 'fleet')
  drones!: Drone[];
} 