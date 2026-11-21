import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AppLogger } from './app-logger.js';
import type { AppLog } from './app-log.js';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  constructor(private readonly appLogger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      const body = requestBody(req.body);
      const entry: AppLog = {
        operation: `${req.method} ${pathOf(req)}`,
        ...(req.requestId ? { requestId: req.requestId } : {}),
        userId: req.user?.id ?? null,
        metadata: {
          statusCode: res.statusCode,
          ...(body ? { body } : {}),
        },
      };
      if (res.statusCode >= 500) {
        this.appLogger.error(entry);
      } else if (res.statusCode >= 400) {
        this.appLogger.warn(entry);
      } else {
        this.appLogger.info(entry);
      }
    });

    next();
  }
}

const SECRET_KEY = /password|token|secret|authorization/i;

const pathOf = (req: Request) => (req.originalUrl ?? req.url).split('?')[0];

const requestBody = (body: unknown): Record<string, unknown> | undefined => {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return undefined;
  }
  if (Object.keys(body).length === 0) {
    return undefined;
  }
  return redact(body) as Record<string, unknown>;
};

const redact = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SECRET_KEY.test(key) ? '[redacted]' : redact(item),
    ]),
  );
};
