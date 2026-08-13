# nestjs-oracle

Maqueta de referencia: NestJS + Oracle, conectados con TypeORM, corriendo en Docker.
Objetivo: que quien nunca se conectó a Oracle vea, en pocos minutos, una app real
hablando con una base Oracle sin instalar nada nativo (Instant Client incluido).

## Quickstart

```bash
docker compose up -d      # levanta Oracle 23ai Free (primer arranque: 1-2 min)
cp .env.example .env
npm install
npm run start:dev         # crea las tablas y arranca en http://localhost:3000
```

Documentacion de la API en Swagger: http://localhost:3000/api

Esperar a que el contenedor esté `healthy` antes de arrancar la app:

```bash
docker compose ps
```

## Cómo está armado

- **TypeORM** (`@nestjs/typeorm`) sobre `oracledb`, en **modo thin**: sin instalar Oracle
  Instant Client. Es la parte que suele bloquear a un equipo nuevo con Oracle.
- Conexión configurada en [`src/database/database.module.ts`](src/database/database.module.ts),
  variables validadas en [`src/config/env.validation.ts`](src/config/env.validation.ts).
- Módulo de ejemplo: [`src/senadores`](src/senadores) — CRUD estándar (crear, listar, leer,
  actualizar, borrar). `region` es una relación `@ManyToOne` a [`src/regiones`](src/regiones),
  no un texto suelto: ejemplo mínimo de FK en Oracle vía TypeORM.
- [`src/regiones`](src/regiones) siembra unas pocas regiones al arrancar (si la tabla está
  vacía) para que la relación tenga datos usables desde el primer `start:dev`. `GET /regiones`
  para ver los IDs que acepta `POST /senadores`.
- `synchronize: true` en el `TypeOrmModule` crea las tablas automáticamente. **Solo vale
  para esta maqueta** — contra un Oracle real se usan migraciones de TypeORM.

## Troubleshooting

- **"No se conecta"**: el service name de Oracle 23ai Free es `FREEPDB1`, no `XE` ni
  `ORCL`. Revisa `ORACLE_CONNECT_STRING` en tu `.env`.
- **Nombres en mayúsculas**: Oracle normaliza identificadores a MAYÚSCULAS. Las entidades
  fijan `name:` explícito en `@Entity`/`@Column` para no depender de comillas.
- **Identificadores largos**: si el Oracle destino es anterior a 12.2, el límite de nombres
  es 30 caracteres (en 23ai son 128). Puede afectar nombres de FK autogenerados.
- **Apuntar al Oracle de la empresa**: cambia solo las variables en `.env`
  (`ORACLE_CONNECT_STRING`, `ORACLE_USER`, `ORACLE_PASSWORD`) — el código no cambia.

## Fuera de alcance (a propósito)

Migraciones versionadas, auth y healthcheck `/health` quedaron fuera para mantener esto
como una maqueta mínima. Se agregan cuando esto deje de ser una referencia y empiece a ser
un servicio real.
