import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import type { User } from "./User.js";
import type { Fleet } from "./Fleet.js";
import type { Site } from "./Site.js";
import type { Mission } from "./Mission.js";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "varchar", default: "active" })
  status!: "active" | "suspended";

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @OneToMany('User', 'organization')
  users!: User[];

  @OneToMany('Fleet', 'organization')
  fleets!: Fleet[];

  @OneToMany('Site', 'organization')
  sites!: Site[];

  @OneToMany('Mission', 'organization')
  missions!: Mission[];
} 