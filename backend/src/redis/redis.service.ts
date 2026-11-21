import { createClient, type RedisClientType } from 'redis';

export class RedisService {
  private static instance: RedisService | null = null;
  private readonly client: RedisClientType;

  private constructor(url: string) {
    this.client = createClient({ url });
  }

  static async getInstance(url: string): Promise<RedisService> {
    if (!RedisService.instance) {
      const service = new RedisService(url);
      await service.client.connect();
      RedisService.instance = service;
    }
    return RedisService.instance;
  }

  increment(key: string): Promise<number> {
    return this.client.incr(key);
  }

  secondsToLive(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async close(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
    if (RedisService.instance === this) {
      RedisService.instance = null;
    }
  }
}
