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

  /**
   * Siembra las regiones de ejemplo la primera vez que arranca la app
   * (no hay un seed script separado; esto reemplaza esa necesidad para la maqueta).
   */
  async onModuleInit(): Promise<void> {
    const count = await this.regionesRepo.count();
    if (count === 0) {
      await this.regionesRepo.save(
        REGIONES_EJEMPLO.map((nombre) => this.regionesRepo.create({ nombre })),
      );
    }
  }

  /**
   * Buscar todas las regiones
   * @returns Lista completa de regiones
   */
  findAll(): Promise<Region[]> {
    return this.regionesRepo.find();
  }

  /**
   * Buscar una región por su ID
   * @param id ID de la región
   * @returns La región encontrada
   */
  async findOne(id: number): Promise<Region> {
    const region = await this.regionesRepo.findOneBy({ id });
    if (!region) {
      throw new NotFoundException(`Región ${id} no encontrada`);
    }
    return region;
  }

  /**
   * Crear una región
   * @param dto Objeto con los datos de la región a crear
   * @returns La región creada
   */
  create(dto: CreateRegionDto): Promise<Region> {
    return this.regionesRepo.save(
      this.regionesRepo.create({ nombre: dto.nombre }),
    );
  }

  /**
   * Eliminar una región por su ID
   * @param id ID de la región
   */
  async remove(id: number): Promise<void> {
    const region = await this.findOne(id);
    // Validado a mano porque no hay ON DELETE RESTRICT/cascade configurado en TypeORM.
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
