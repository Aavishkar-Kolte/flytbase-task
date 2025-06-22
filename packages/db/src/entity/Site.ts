import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import type { Organization } from "./Organization.js";
import type { Mission } from "./Mission.js";

@Entity("sites")
@Index("idx_sites_boundary_coordinates", { synchronize: false })
export class Site {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  org_id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "geometry", spatialFeatureType: "Polygon", srid: 4326 })
  boundary_coordinates!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  // Relations
  @ManyToOne('Organization', 'sites')
  @JoinColumn({ name: "org_id" })
  organization!: Organization;

  @OneToMany('Mission', 'site')
  missions!: Mission[];
} 