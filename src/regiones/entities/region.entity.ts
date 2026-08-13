import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'REGIONES' })
export class Region {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NOMBRE', type: 'varchar2', length: 200, unique: true })
  nombre: string;
}
