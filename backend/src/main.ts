import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('Database connected successfully');
  } else {
    console.log('Database connection failed');
  }
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Server listening on port ${port}`);
}
bootstrap();