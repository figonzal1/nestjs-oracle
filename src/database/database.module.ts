import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        connectString: config.getOrThrow('ORACLE_CONNECT_STRING'),
        username: config.getOrThrow('ORACLE_USER'),
        password: config.getOrThrow('ORACLE_PASSWORD'),
        autoLoadEntities: true,
        // synchronize: SOLO para esta maqueta. En un Oracle real se usan
        // migraciones de TypeORM; dejar esto en true machaca el esquema.
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
