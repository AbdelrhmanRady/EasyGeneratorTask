import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  refreshTokenSchema,
  refreshedTokenResponseSchema,
  sessionResponseSchema,
  signInSchema,
  signUpSchema,
  type RefreshTokenDto,
  type SignInDto,
  type SignUpDto,
} from './auth.schemas.js';
import { AuthService } from './auth.service.js';

@ApiTags('auth')
@ApiTooManyRequestsResponse({ description: 'Too many requests from this IP' })
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'Account created and signed in',
    standardSchema: sessionResponseSchema,
  })
  @ApiBadRequestResponse({ description: 'The email, name, or password is invalid' })
  @ApiConflictResponse({ description: 'Email already registered' })
  signUp(@Body({ schema: signUpSchema }) body: SignUpDto) {
    return this.authService.signUp(body.email, body.name, body.password);
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Signed in', standardSchema: sessionResponseSchema })
  @ApiBadRequestResponse({ description: 'The email or password is invalid' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  signIn(@Body({ schema: signInSchema }) body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('token/refresh')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'A new access token and refresh token',
    standardSchema: refreshedTokenResponseSchema,
  })
  @ApiBadRequestResponse({ description: 'The refresh token is missing' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  refresh(@Body({ schema: refreshTokenSchema }) body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }
}
