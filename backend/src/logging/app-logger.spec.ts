import { Logger } from '@nestjs/common';
import { AppLogger } from './app-logger.js';

describe('AppLogger', () => {
  const logger = new AppLogger();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes a successful operation with info', () => {
    const log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

    logger.info({ operation: 'POST /auth/sign-in', userId: 'user-1' });

    expect(log).toHaveBeenCalledWith({ operation: 'POST /auth/sign-in', userId: 'user-1' });
  });

  it('writes a client failure with warn', () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    logger.warn({ operation: 'POST /auth/sign-in', metadata: { statusCode: 401 } });

    expect(warn).toHaveBeenCalledWith({
      operation: 'POST /auth/sign-in',
      metadata: { statusCode: 401 },
    });
  });

  it('writes an application failure with error and the stack', () => {
    const error = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const failure = new Error('database down');

    logger.error({ operation: 'POST /auth/sign-in' }, failure);

    expect(error).toHaveBeenCalledWith({ operation: 'POST /auth/sign-in' }, failure.stack);
  });
});
