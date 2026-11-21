import { HttpException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { RateLimitGuard } from './rate-limit.guard.js';
import type { RedisService } from '../redis/redis.service.js';

describe('RateLimitGuard', () => {
  const config = {
    get: (key: string) => (key === 'RATE_LIMIT_MAX' ? 2 : 60),
  } as unknown as ConfigService<Env, true>;

  function guard(redis: {
    increment: ReturnType<typeof vi.fn>;
    secondsToLive: ReturnType<typeof vi.fn>;
    expire: ReturnType<typeof vi.fn>;
  }) {
    return new RateLimitGuard(redis as unknown as RedisService, config);
  }

  function context(ip = '127.0.0.1') {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ ip, socket: {} }),
      }),
    } as never;
  }

  it('counts the first request from an ip and sets the expiry', async () => {
    const redis = {
      increment: vi.fn(async () => 1),
      secondsToLive: vi.fn(async () => -1),
      expire: vi.fn(async () => true),
    };

    await expect(guard(redis).canActivate(context())).resolves.toBe(true);
    expect(redis.increment).toHaveBeenCalledWith('rate-limit:127.0.0.1');
    expect(redis.expire).toHaveBeenCalledWith('rate-limit:127.0.0.1', 60);
  });

  it('rejects an ip that is over the limit', async () => {
    const redis = {
      increment: vi.fn(async () => 3),
      secondsToLive: vi.fn(async () => 40),
      expire: vi.fn(),
    };

    await expect(guard(redis).canActivate(context())).rejects.toBeInstanceOf(HttpException);
    expect(redis.expire).not.toHaveBeenCalled();
  });
});