import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Utiliser CORS
  app.use(cors({
    origin: [configService.get('FRONTEND_URL'), configService.get('FRONTEND_URL2')],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();