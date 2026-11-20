import { UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { RefreshTokensService } from './refresh-tokens.service.js';

describe('RefreshTokensService', () => {
  it('stores a hash of the refresh token', async () => {
    const model = { create: vi.fn(async () => undefined) };
    const service = new RefreshTokensService(model as never);

    const refreshToken = await service.create('user-1');

    expect(refreshToken).not.toHaveLength(0);
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        tokenHash: createHash('sha256').update(refreshToken).digest('hex'),
      }),
    );
  });

  it('returns the user id and removes the token', async () => {
    const model = {
      findOneAndDelete: vi.fn(() => ({
        lean: () => ({
          exec: async () => ({
            userId: 'user-1',
            expiresAt: new Date(Date.now() + 60_000),
          }),
        }),
      })),
    };
    const service = new RefreshTokensService(model as never);

    await expect(service.consume('refresh-token')).resolves.toBe('user-1');
  });

  it('rejects a token that is not in the database', async () => {
    const model = {
      findOneAndDelete: vi.fn(() => ({
        lean: () => ({ exec: async () => null }),
      })),
    };
    const service = new RefreshTokensService(model as never);

    await expect(service.consume('missing')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
