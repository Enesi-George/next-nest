import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Use Railway's PORT environment variable and bind to 0.0.0.0
  const port = process.env.PORT || 3001;
  const host = '0.0.0.0'; // Important for Railway
  
  await app.listen(port, host);
  console.log(`🚀 Application is running on: http://${host}:${port}`);
}
bootstrap();