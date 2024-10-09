import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.validateUser(username, password);
    return { accessToken };
  }
}
