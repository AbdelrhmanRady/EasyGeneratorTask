import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  refreshTokenSchema,
  signInSchema,
  signUpSchema,
  type RefreshTokenDto,
  type SignInDto,
  type SignUpDto,
} from './auth.schemas.js';
import { AuthService } from './auth.service.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body({ schema: signUpSchema }) body: SignUpDto) {
    return this.authService.signUp(body.email, body.name, body.password);
  }

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body({ schema: signInSchema }) body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('token/refresh')
  @HttpCode(200)
  refresh(@Body({ schema: refreshTokenSchema }) body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }
}
