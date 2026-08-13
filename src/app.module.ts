import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { RegionesModule } from './regiones/regiones.module';
import { SenadoresModule } from './senadores/senadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    DatabaseModule,
    RegionesModule,
    SenadoresModule,
  ],
})
export class AppModule {}
