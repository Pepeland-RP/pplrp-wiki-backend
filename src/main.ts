import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(morgan(':method :url :status - :response-time ms'));
  app.useBodyParser('json', { limit: '10mb' });
  app.setGlobalPrefix('api');

  /* Пока корс не нужен
  app.enableCors({
    origin: `http://localhost:${process.env.PORT}`,
    credentials: true,
  });
  */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/assets/',
    setHeaders: res => {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    },
  });

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
