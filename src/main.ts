import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // or ["http://localhost:8081", "http://192.168.x.x:8081"]
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const port = process.env.PORT ?? 3000;
  console.log('App running on port ', port);
  await app.listen(port);
}
bootstrap();
