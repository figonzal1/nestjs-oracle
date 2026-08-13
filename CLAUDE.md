# CLAUDE.md

Este archivo le da a Claude Code (claude.ai/code) contexto para trabajar en este repositorio.

## Qué es este proyecto

Una **maqueta de referencia** que muestra NestJS + Oracle + TypeORM, usando `oracledb` en modo thin para no requerir instalar Oracle Instant Client. No es código de producción. Migraciones versionadas, auth y un endpoint `/health` quedan fuera de alcance a propósito por ahora.

## Cómo correrlo localmente

```
docker compose up -d          # Oracle 23ai Free; el primer arranque tarda 1-2 min
docker compose ps             # esperar a que el estado sea "healthy" antes de arrancar la app
cp .env.example .env
npm install
npm run start:dev
```

App: `http://localhost:3000`. Documentación Swagger: `http://localhost:3000/api`.

Variables de entorno requeridas (ver `src/config/env.validation.ts`): `ORACLE_CONNECT_STRING`, `ORACLE_USER`, `ORACLE_PASSWORD`, `PORT` (default 3000). Para apuntar a otra instancia de Oracle solo hay que cambiar el `.env`.

## Comandos

- `npm run start:dev` — modo watch
- `npm run build` — `nest build`
- `npm run lint` — eslint --fix sobre src/apps/libs/test
- `npm run format` — prettier --write
- `npm test` — tests unitarios (`*.spec.ts` junto al código en `src/`)
- `npm run test:e2e` — tests e2e (`test/*.e2e-spec.ts`); pegan contra una instancia real de Oracle vía supertest (sin mocks), así que `docker compose up -d` debe estar corriendo antes

No hay CI configurado en este repo — lint/build/test solo corren localmente, así que hay que correrlos manualmente antes de dar un cambio por terminado.

## Particularidades de la base de datos (específicas de Oracle)

- `src/database/database.module.ts` tiene `synchronize: true`. Esto es solo para la maqueta (crea/altera tablas automáticamente a partir de las entidades) y es explícitamente inseguro contra un Oracle real — puede destruir el esquema. Si este proyecto alguna vez apunta a un Oracle que no sea de maqueta, cambiar a migraciones de TypeORM.
- Oracle normaliza los identificadores sin comillas a MAYÚSCULAS. Todas las entidades fijan `name:` explícito en `@Entity`/`@Column` (ej. `@Entity({ name: 'REGIONES' })`) para calzar con esto — seguir ese patrón en entidades/columnas nuevas.
- El connect string por defecto apunta al service name de Oracle 23ai Free, `FREEPDB1`, no `XE` ni `ORCL`.
- Se usa `autoLoadEntities: true` en vez de un glob explícito de `entities` — las entidades nuevas se detectan automáticamente siempre que estén registradas vía `TypeOrmModule.forFeature([...])` en su módulo.

## Patrón de módulo

Cada módulo de dominio (ver `src/regiones`, `src/senadores`) sigue esta forma — reutilizarla para módulos nuevos en vez de inventar una estructura distinta:

- `*.entity.ts` bajo `entities/` — entidad TypeORM con nombres de columna explícitos para Oracle.
- `dto/create-*.dto.ts` — decoradores de `class-validator` + `@ApiProperty` para Swagger. `dto/update-*.dto.ts` usa `PartialType(CreateXDto)` de `@nestjs/mapped-types`.
- `*.service.ts` — inyecta `Repository<T>` directamente vía `@InjectRepository`; sin clases de repositorio custom. Las búsquedas que no encuentran resultado lanzan `NotFoundException` directamente (no hay exception filters en este proyecto).
- `*.controller.ts` — delgado, `@ApiTags(...)`, `ParseIntPipe` en los `:id` numéricos.
- La validación es global (`ValidationPipe({ whitelist: true, transform: true })` en `main.ts`) — los DTOs no necesitan pipes por ruta.
- No existen guards, interceptors ni exception filters custom en el proyecto; no agregar uno para un solo caso de uso.
