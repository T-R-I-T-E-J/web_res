
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);

  const email = 'admin@psci.in';
  const password = 'admin123';

  // Check if exists
  let user = await usersService.findByEmail(email);
  if (!user) {
    user = await usersService.create({
      email,
      password,
      first_name: 'Admin',
      last_name: 'User',
      phone_number: '1234567890',
      role_id: 1, // Assuming 1 is admin, we will verify
    });
    console.log('User created');
  } else {
    console.log('User exists');
  }

  // Get Token
  const token = await authService.login(user);
  console.log('TOKEN:' + token.access_token);
  
  await app.close();
}
bootstrap();

