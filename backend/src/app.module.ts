import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuthenticationModule } from '@nestjs/authentication';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AuthModule } from './auth/auth.module.js';
import { LoggingModule } from './logging/logging.module.js';
import { RateLimitModule } from './rate-limit/rate-limit.module.js';
import { RedisModule } from './redis/redis.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { envSchema, type Env } from './config/env.schema.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        uri: config.get('MONGODB_URI', { infer: true }),
      }),
    }),
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        accessToken: {
          key: config.get('JWT_SECRET', { infer: true }),
          issuer: 'easygenerator',
          audience: 'easygenerator',
          ttl: '15m',
        },
        refreshToken: false,
      }),
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    LoggingModule,
    RedisModule,
    RateLimitModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: StandardSchemaValidationPipe }],
})
export class AppModule {}
