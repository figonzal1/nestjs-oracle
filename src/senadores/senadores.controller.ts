import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSenadorDto } from './dto/create-senador.dto';
import { UpdateSenadorDto } from './dto/update-senador.dto';
import { SenadoresService } from './senadores.service';

@ApiTags('senadores')
@Controller('senadores')
export class SenadoresController {
  constructor(private readonly senadoresService: SenadoresService) {}

  @Post()
  create(@Body() dto: CreateSenadorDto) {
    return this.senadoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.senadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.senadoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSenadorDto) {
    return this.senadoresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.senadoresService.remove(id);
  }
}
