import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

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

  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
