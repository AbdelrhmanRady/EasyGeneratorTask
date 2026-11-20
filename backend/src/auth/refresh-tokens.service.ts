import { createHash, randomBytes } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenEntity } from './schemas/refresh-token.schema.js';

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectModel(RefreshTokenEntity.name) private readonly refreshTokenModel: Model<RefreshTokenEntity>,
  ) {}

  async create(userId: string): Promise<string> {
    const refreshToken = randomBytes(32).toString('base64url');
    const now = new Date();
    await this.refreshTokenModel.create({
      tokenHash: hashToken(refreshToken),
      userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
    });
    return refreshToken;
  }

  /** Deletes the token. A missing or expired row is rejected. */
  async consume(refreshToken: string): Promise<string> {
    const row = await this.refreshTokenModel
      .findOneAndDelete({ tokenHash: hashToken(refreshToken) })
      .lean()
      .exec();
    if (!row || row.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return row.userId;
  }
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
