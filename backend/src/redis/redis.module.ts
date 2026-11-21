import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { RedisService } from './redis.service.js';

@Module({
  providers: [
    {
      provide: RedisService,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        RedisService.getInstance(config.get('REDIS_URL', { infer: true })),
    },
  ],
  exports: [RedisService],
})
export class RedisModule implements OnModuleDestroy {
  constructor(private readonly redis: RedisService) {}

  async onModuleDestroy(): Promise<void> {
    await this.redis.close();
  }
}
