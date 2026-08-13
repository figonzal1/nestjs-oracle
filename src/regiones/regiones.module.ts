import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { RegionesController } from './regiones.controller';
import { RegionesService } from './regiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionesController],
  providers: [RegionesService],
  exports: [TypeOrmModule],
})
export class RegionesModule {}
