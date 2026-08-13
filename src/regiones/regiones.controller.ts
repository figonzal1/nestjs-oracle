import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegionesService } from './regiones.service';

@ApiTags('regiones')
@Controller('regiones')
export class RegionesController {
  constructor(private readonly regionesService: RegionesService) {}

  @Get()
  findAll() {
    return this.regionesService.findAll();
  }
}
