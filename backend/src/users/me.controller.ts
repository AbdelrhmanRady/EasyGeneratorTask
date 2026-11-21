import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { userResponseSchema } from '../auth/auth.schemas.js';
import type { User } from './user.js';

@ApiTags('me')
@ApiBearerAuth()
@Controller('me')
export class MeController {
  @Get()
  @ApiOkResponse({ description: 'The signed-in user', standardSchema: userResponseSchema })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  me(@CurrentUser() user: User) {
    return user;
  }
}
