import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cors({
    // 2 URL pour localhost et 127.0.0.1 (problème de cors)
    origin: [configService.get('FRONTEND_URL'), configService.get('FRONTEND_URL2')],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();