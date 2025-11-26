import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);

  // Create admin user
  try {
    await usersService.create({
      email: 'admin@gmail.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin user created: admin@gmail.com / admin123');
  } catch (error) {
    if (error.code === '23505') {
      console.log('Admin user already exists');
    } else {
      console.log('Error creating admin user:', error.message);
    }
  }

  // Create a regular user for testing
  try {
    await usersService.create({
      email: 'user@gmail.com',
      password: 'user123',
      isAdmin: false,
    });
    console.log('Test user created: user@gmail.com / user123');
  } catch (error) {
    if (error.code === '23505') {
      console.log('Test user already exists');
    } else {
      console.log('Error creating test user:', error.message);
    }
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch(error => {
  console.error('Seed failed:', error);
  process.exit(1);
});