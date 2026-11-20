import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import type { User } from '../users/user.js';
import { UsersRepository } from '../users/users.repository.js';
import { RefreshTokensService } from './refresh-tokens.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly refreshTokens: RefreshTokensService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const user = await this.usersRepository.create(
      email,
      name,
      await this.passwordHasher.hash(password),
    );
    if (!user) {
      throw new ConflictException('Email already registered');
    }
    return this.issueSession(user);
  }

  async signIn(email: string, password: string) {
    const found = await this.usersRepository.findCredentials(email);
    const valid = await this.passwordHasher.verify(password, found?.passwordHash);
    if (!valid || !found) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      await this.usersRepository.updatePasswordHash(
        found.user.id,
        await this.passwordHasher.hash(password),
      );
    }
    return this.issueSession(found.user);
  }

  async refresh(refreshToken: string) {
    const userId = await this.refreshTokens.consume(refreshToken);
    const access = await this.tokenService.issue(userId, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
    return { ...access, refreshToken: await this.refreshTokens.create(userId) };
  }

  private async issueSession(user: User) {
    const access = await this.tokenService.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
    return { user, ...access, refreshToken: await this.refreshTokens.create(user.id) };
  }
}
