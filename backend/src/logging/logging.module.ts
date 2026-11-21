import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccessLogMiddleware } from './access-log.middleware.js';
import { AppLogger } from './app-logger.js';
import { RequestIdMiddleware } from './request-id.middleware.js';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware, AccessLogMiddleware).forRoutes('{*splat}');
  }
}
