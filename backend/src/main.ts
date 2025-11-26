import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add root endpoint for health checks
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({ 
      status: 'OK',
      message: 'Appointment Booking API',
      timestamp: new Date().toISOString()
    });
  });

  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`🚀 Application is running on: http://${host}:${port}`);
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});