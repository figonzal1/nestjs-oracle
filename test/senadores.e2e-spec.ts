import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Senadores (e2e)', () => {
  let app: INestApplication;
  let regionId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const regionesRes = await request(app.getHttpServer())
      .get('/regiones')
      .expect(200);
    regionId = regionesRes.body[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('crea, lee, actualiza y borra un senador', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/senadores')
      .send({ nombre: 'Ada Lovelace', partido: 'Independiente', regionId })
      .expect(201);

    const id = createRes.body.id;
    expect(createRes.body.region.id).toBe(regionId);

    await request(app.getHttpServer())
      .patch(`/senadores/${id}`)
      .send({ partido: 'Nuevo Partido' })
      .expect(200)
      .expect((res) => expect(res.body.partido).toBe('Nuevo Partido'));

    await request(app.getHttpServer()).delete(`/senadores/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/senadores/${id}`).expect(404);
  });

  it('devuelve 404 al crear un senador con una región inexistente', () => {
    return request(app.getHttpServer())
      .post('/senadores')
      .send({ nombre: 'Nadie', partido: 'Nadie', regionId: 999999 })
      .expect(404);
  });
});
