import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signin() {
    return 'signin user';
  }

  async login() {
    return 'login user';
  }

  async logout() {
    return 'logout user';
  }

  async checkAuth() {
    return 'check user auth status';
  }
}
