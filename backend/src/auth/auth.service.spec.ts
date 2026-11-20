import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { AuthService } from './auth.service.js';
import type { RefreshTokensService } from './refresh-tokens.service.js';
import type { UsersRepository } from '../users/users.repository.js';
import type { User } from '../users/user.js';

const user: User = {
  id: 'user-1',
  email: 'ada@example.com',
  name: 'Ada',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('AuthService', () => {
  const hasher = new PasswordHasher({ logN: 10 });
  const tokenService = {
    issue: vi.fn(async () => ({ accessToken: 'access', expiresIn: 900 })),
  };
  const refreshTokens = {
    create: vi.fn(async () => 'refresh'),
    consume: vi.fn(async () => user.id),
  };

  function service(users: Partial<UsersRepository>) {
    return new AuthService(
      users as UsersRepository,
      hasher,
      tokenService as never,
      refreshTokens as unknown as RefreshTokensService,
    );
  }

  it('stores a password hash and returns a session', async () => {
    const users = {
      create: vi.fn(async (_email: string, _name: string, passwordHash: string) => {
        expect(passwordHash.startsWith('$scrypt$')).toBe(true);
        return user;
      }),
    };

    await expect(service(users).signUp(user.email, user.name, 'Password1!')).resolves.toEqual({
      user,
      accessToken: 'access',
      expiresIn: 900,
      refreshToken: 'refresh',
    });
  });

  it('rejects a duplicate email', async () => {
    const users = { create: vi.fn(async () => null) };

    await expect(service(users).signUp(user.email, user.name, 'Password1!')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('rejects a wrong password before issuing tokens', async () => {
    const passwordHash = await hasher.hash('Password1!');
    tokenService.issue.mockClear();
    const users = {
      findCredentials: vi.fn(async () => ({ user, passwordHash })),
      updatePasswordHash: vi.fn(),
    };

    await expect(service(users).signIn(user.email, 'wrong-pass')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(tokenService.issue).not.toHaveBeenCalled();
  });

  it('returns a session for the right password', async () => {
    const passwordHash = await hasher.hash('Password1!');
    const users = {
      findCredentials: vi.fn(async () => ({ user, passwordHash })),
      updatePasswordHash: vi.fn(),
    };

    await expect(service(users).signIn(user.email, 'Password1!')).resolves.toMatchObject({
      user,
      accessToken: 'access',
      refreshToken: 'refresh',
    });
    expect(refreshTokens.create).toHaveBeenCalledWith(user.id);
  });
});
