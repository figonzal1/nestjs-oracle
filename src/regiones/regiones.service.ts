import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { Senador } from '../senadores/entities/senador.entity';

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

  async findOne(id: number): Promise<Region> {
    const region = await this.regionesRepo.findOneBy({ id });
    if (!region) {
      throw new NotFoundException(`Región ${id} no encontrada`);
    }
    return region;
  }

  create(dto: CreateRegionDto): Promise<Region> {
    return this.regionesRepo.save(this.regionesRepo.create({ nombre: dto.nombre }));
  }

  async remove(id: number): Promise<void> {
    const region = await this.findOne(id);
    const senadoresAsociados = await this.regionesRepo.manager
      .getRepository(Senador)
      .count({ where: { region: { id } } });
    if (senadoresAsociados > 0) {
      throw new ConflictException(
        `No se puede borrar la región ${id}: tiene senadores asociados`,
      );
    }
    await this.regionesRepo.remove(region);
  }
}
