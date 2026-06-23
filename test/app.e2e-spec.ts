import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: any;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);
    server = app.getHttpServer();
    await app.init();
  });

  describe(`/ GET`, () => {
    it('should return 401 when invalid API key is provided', () => {
      return request(server)
        .get('/')
        .set('x-api-key', 'invalid-key')
        .expect(401);
    });
    it('should return 401 when no API key is provided', () => {
      return request(server).get('/').expect(401);
    });
    it('should return random emoji with valid API key', () => {
      const emojis = appService.getEmojis();
      return request(server)
        .get('/')
        .set('x-api-key', 'SECRET')
        .expect(
          ({
            body,
          }: {
            body: { data: { emoji: string; browser: string } };
          }) => {
            expect(200);
            expect(emojis).toContain(body.data.emoji);
            expect(body.data.browser).toBe(`Unknown`);
          },
        );
    });

    it('should return first emoji when index=0', () => {
      const firstEmoji = appService.getEmojis()[0];
      return request(server)
        .get('/?index=0')
        .set('x-api-key', 'SECRET')
        .expect(({ body }) => {
          expect(200);
          expect(body.data.emoji).toBe(firstEmoji);
        });
    });

    it('should return 400 when index is out of bounds', () => {
      return request(server)
        .get('/?index=100')
        .set('x-api-key', 'SECRET')
        .expect(400);
    });

    it('should return 400 when index is not a number', () => {
      return request(server)
        .get('/?index=abc')
        .set('x-api-key', 'SECRET')
        .expect(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
