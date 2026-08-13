import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegionesService } from './regiones.service';
import { CreateRegionDto } from './dto/create-region.dto';

@ApiTags('regiones')
@Controller('regiones')
export class RegionesController {
  constructor(private readonly regionesService: RegionesService) {}

  @Get()
  findAll() {
    return this.regionesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.regionesService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.regionesService.remove(id);
  }
}
