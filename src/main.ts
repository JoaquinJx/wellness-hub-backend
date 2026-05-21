import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // Debug: print which env vars are present at startup
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
  required.forEach((key) => {
    const val = process.env[key];
    console.log(`[ENV] ${key}: ${val ? `SET (${val.length} chars)` : 'MISSING'}`);
  });

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // HTTP security headers
  app.use(helmet());

  // CORS — origin from env, fallback to localhost for dev
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  });

  // Validate and strip unknown fields on all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap().catch(console.error);
