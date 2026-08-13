import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionesModule } from '../regiones/regiones.module';
import { Senador } from './entities/senador.entity';
import { SenadoresController } from './senadores.controller';
import { SenadoresService } from './senadores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Senador]), RegionesModule],
  controllers: [SenadoresController],
  providers: [SenadoresService],
})
export class SenadoresModule {}
