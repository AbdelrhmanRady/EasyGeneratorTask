import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { Env } from '../config/env.schema.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const key = `rate-limit:${ip}`;
    const count = await this.redis.increment(key);
    console.log("test",key, count, this.config.get('RATE_LIMIT_TTL_SECONDS', { infer: true }), this.config.get('RATE_LIMIT_MAX', { infer: true }));
    if (count === 1) {
      await this.redis.expire(key, this.config.get('RATE_LIMIT_TTL_SECONDS', { infer: true }));
    }
    if (count > this.config.get('RATE_LIMIT_MAX', { infer: true })) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}
