import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from '../../regiones/entities/region.entity';

@Entity({ name: 'SENADORES' })
export class Senador {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NOMBRE', type: 'varchar2', length: 200 })
  nombre: string;

  @Column({ name: 'PARTIDO', type: 'varchar2', length: 200 })
  partido: string;

  @ManyToOne(() => Region, { eager: true, nullable: false })
  @JoinColumn({ name: 'REGION_ID' })
  region: Region;
}
