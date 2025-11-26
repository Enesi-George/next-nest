import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://next-nest-gamma.vercel.app/',
    ],
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();