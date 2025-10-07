import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
describe('UserController e2e', () => {
  let app: NestApplication;
  beforeAll(async () => {
    const module = Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await module).createNestApplication();
    await app.init();
  });

  it('can create user in db', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'ab@y.com', password: 'abcde', name: 'ubuntu' });

    const { email, userId } = res.body;
    expect(email).toEqual('ab@y.com');
    expect(userId).toBeDefined();
  });
});
