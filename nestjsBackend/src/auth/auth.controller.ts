import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signin() {
    return this.authService.signin();
  }

  @Post()
  login() {
    return this.authService.login();
  }

  @Post()
  logout() {
    return this.authService.logout();
  }

  @Get()
  checkAuth() {
    return this.authService.checkAuth();
  }
}
