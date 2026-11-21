import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '../redis/redis.module.js';
import { RateLimitGuard } from './rate-limit.guard.js';

@Module({
  imports: [RedisModule],
  providers: [{ provide: APP_GUARD, useClass: RateLimitGuard }],
})
export class RateLimitModule {}
