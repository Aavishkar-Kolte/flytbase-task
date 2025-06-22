import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Organization } from "./Organization.js";
import type { Mission } from "./Mission.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true, nullable: true })
  google_id?: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  role!: "admin" | "operator" | "viewer";

  @Column({ type: "boolean", default: false })
  is_root!: boolean;

  @Column({ type: "integer" })
  org_id!: number;

  @Column({ type: "varchar", default: "active" })
  status!: "active" | "inactive";

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Organization', 'users')
  @JoinColumn({ name: "org_id" })
  organization!: Organization;

  @OneToMany('Mission', 'createdBy')
  createdMissions!: Mission[];
} 