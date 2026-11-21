import { AccessLogMiddleware } from './access-log.middleware.js';
import type { AppLogger } from './app-logger.js';

describe('AccessLogMiddleware', () => {
  const appLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  function response(statusCode: number) {
    const listeners = new Map<string, Array<() => void>>();
    const res = {
      statusCode,
      json: vi.fn((body: unknown) => body),
      on(event: string, listener: () => void) {
        listeners.set(event, [...(listeners.get(event) ?? []), listener]);
      },
      finish() {
        listeners.get('finish')?.forEach((listener) => listener());
      },
    };
    return res;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs a successful response as info', () => {
    const middleware = new AccessLogMiddleware(appLogger as unknown as AppLogger);
    const res = response(201);
    const req = { method: 'POST', originalUrl: '/auth/sign-up', requestId: 'req-1' };

    middleware.use(req as never, res as never, () => undefined);
    res.finish();

    expect(appLogger.info).toHaveBeenCalledWith({
      operation: 'POST /auth/sign-up',
      requestId: 'req-1',
      userId: null,
      metadata: { statusCode: 201 },
    });
  });

  it('logs a client error as warn', () => {
    const middleware = new AccessLogMiddleware(appLogger as unknown as AppLogger);
    const res = response(401);
    const req = { method: 'POST', originalUrl: '/auth/sign-in?unused=1', requestId: 'req-2' };

    middleware.use(req as never, res as never, () => undefined);
    res.finish();

    expect(appLogger.warn).toHaveBeenCalledWith({
      operation: 'POST /auth/sign-in',
      requestId: 'req-2',
      userId: null,
      metadata: { statusCode: 401 },
    });
  });

  it('includes the request body and hides secrets', () => {
    const middleware = new AccessLogMiddleware(appLogger as unknown as AppLogger);
    const res = response(200);
    const req = {
      method: 'POST',
      originalUrl: '/auth/sign-in',
      requestId: 'req-4',
      body: { email: 'ada@example.com', password: 'Password1!', refreshToken: 'secret-token' },
    };

    middleware.use(req as never, res as never, () => undefined);
    res.finish();

    expect(appLogger.info).toHaveBeenCalledWith({
      operation: 'POST /auth/sign-in',
      requestId: 'req-4',
      userId: null,
      metadata: {
        statusCode: 200,
        body: { email: 'ada@example.com', password: '[redacted]', refreshToken: '[redacted]' },
      },
    });
  });

  it('logs an application failure as error', () => {
    const middleware = new AccessLogMiddleware(appLogger as unknown as AppLogger);
    const res = response(500);
    const req = { method: 'GET', originalUrl: '/me', requestId: 'req-3', user: { id: 'user-1' } };

    middleware.use(req as never, res as never, () => undefined);
    res.finish();

    expect(appLogger.error).toHaveBeenCalledWith({
      operation: 'GET /me',
      requestId: 'req-3',
      userId: 'user-1',
      metadata: { statusCode: 500 },
    });
  });
});