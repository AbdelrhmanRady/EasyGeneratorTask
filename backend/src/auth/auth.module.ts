import { Module } from '@nestjs/common';
import './authentication.types.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { RefreshTokensService } from './refresh-tokens.service.js';
import { RefreshTokenEntity, RefreshTokenSchema } from './schemas/refresh-token.schema.js';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: RefreshTokenEntity.name, schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [JwtAuth, AuthService, RefreshTokensService],
})
export class AuthModule {}
