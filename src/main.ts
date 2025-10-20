import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(morgan(':method :url :status - :response-time ms'));
  app.useBodyParser('json', { limit: '10mb' });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
