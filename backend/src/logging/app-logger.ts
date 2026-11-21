import { Injectable, Logger } from '@nestjs/common';
import type { AppLog } from './app-log.js';

@Injectable()
export class AppLogger {
  private readonly logger = new Logger(AppLogger.name);

  info(entry: AppLog): void {
    this.logger.log(this.prepare(entry));
  }

  warn(entry: AppLog): void {
    this.logger.warn(this.prepare(entry));
  }

  error(entry: AppLog, error?: unknown): void {
    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(this.prepare(entry), stack);
  }

  private prepare(entry: AppLog): AppLog {
    return Object.fromEntries(
      Object.entries(entry).filter(([, value]) => value !== undefined),
    ) as AppLog;
  }
}
