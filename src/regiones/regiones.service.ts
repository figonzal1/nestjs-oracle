import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

const REGIONES_EJEMPLO = ['Metropolitana', 'Valparaíso', 'Biobío', 'Los Lagos'];

@Injectable()
export class RegionesService implements OnModuleInit {
  constructor(
    @InjectRepository(Region)
    private readonly regionesRepo: Repository<Region>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.regionesRepo.count();
    if (count === 0) {
      await this.regionesRepo.save(
        REGIONES_EJEMPLO.map((nombre) => this.regionesRepo.create({ nombre })),
      );
    }
  }

  findAll(): Promise<Region[]> {
    return this.regionesRepo.find();
  }
}
