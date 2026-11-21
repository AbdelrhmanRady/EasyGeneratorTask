import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().min(1),
  RATE_LIMIT_MAX: z.coerce.number().int().positive(),
  RATE_LIMIT_TTL_SECONDS: z.coerce.number().int().positive(),
});

export type Env = z.infer<typeof envSchema>;
