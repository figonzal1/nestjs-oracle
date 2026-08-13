import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../regiones/entities/region.entity';
import { CreateSenadorDto } from './dto/create-senador.dto';
import { UpdateSenadorDto } from './dto/update-senador.dto';
import { Senador } from './entities/senador.entity';

@Injectable()
export class SenadoresService {
  constructor(
    @InjectRepository(Senador)
    private readonly senadoresRepo: Repository<Senador>,
    @InjectRepository(Region)
    private readonly regionesRepo: Repository<Region>,
  ) {}

  private async resolveRegion(regionId: number): Promise<Region> {
    const region = await this.regionesRepo.findOneBy({ id: regionId });
    if (!region) {
      throw new NotFoundException(`Región ${regionId} no encontrada`);
    }
    return region;
  }

  /**
   * Crear un senador
   * @param dto Objeto con los datos del senador a crear
   * @returns El senador creado, con su región resuelta
   */
  async create(dto: CreateSenadorDto): Promise<Senador> {
    const region = await this.resolveRegion(dto.regionId);
    return this.senadoresRepo.save(
      this.senadoresRepo.create({
        nombre: dto.nombre,
        partido: dto.partido,
        region,
      }),
    );
  }

  /**
   * Buscar todos los senadores
   * @returns Lista completa de senadores
   */
  findAll(): Promise<Senador[]> {
    return this.senadoresRepo.find();
  }

  /**
   * Buscar un senador por su ID
   * @param idSenador ID del senador
   * @returns El senador encontrado
   */
  async findOne(idSenador: number): Promise<Senador> {
    const senador = await this.senadoresRepo.findOneBy({ id: idSenador });
    if (!senador) {
      throw new NotFoundException(`Senador ${idSenador} no encontrado`);
    }
    return senador;
  }

  /**
   * Actualizar un senador por su ID
   * @param idSenador ID del senador
   * @param dto Campos a actualizar (parciales)
   * @returns El senador actualizado
   */
  async update(idSenador: number, dto: UpdateSenadorDto): Promise<Senador> {
    const senador = await this.findOne(idSenador);
    const { regionId, ...rest } = dto;
    Object.assign(senador, rest);
    if (regionId !== undefined) {
      senador.region = await this.resolveRegion(regionId);
    }
    return this.senadoresRepo.save(senador);
  }

  /**
   * Eliminar un senador por su ID
   * @param idSenador ID del senador
   */
  async remove(idSenador: number): Promise<void> {
    const senador = await this.findOne(idSenador);
    await this.senadoresRepo.remove(senador);
  }
}
