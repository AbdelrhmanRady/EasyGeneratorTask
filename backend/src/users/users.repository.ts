import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEntity } from './schemas/user.schema.js';
import type { User } from './user.js';

interface UserRow {
  _id: Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

  /** The new user, or `null` when the email is already registered. */
  async create(email: string, name: string, passwordHash: string): Promise<User | null> {
    try {
      const doc = await this.userModel.create({
        email: normalizeEmail(email),
        name: name.trim(),
        passwordHash,
      });
      return toUser(doc);
    } catch (error) {
      if (isDuplicateKey(error)) {
        return null;
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await this.userModel.findById(id).exec();
    return doc ? toUser(doc) : null;
  }

  /** For password sign-in only. */
  async findCredentials(email: string): Promise<{ user: User; passwordHash: string } | null> {
    const doc = await this.userModel.findOne({ email: normalizeEmail(email) }).exec();
    if (!doc) {
      return null;
    }
    return { user: toUser(doc), passwordHash: doc.passwordHash };
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      return;
    }
    await this.userModel.updateOne({ _id: id }, { passwordHash }).exec();
  }
}

export const normalizeEmail = (email: string) => email.trim().normalize('NFC').toLowerCase();

const toUser = (doc: UserRow): User => ({
  id: doc._id.toString(),
  email: doc.email,
  name: doc.name,
  createdAt: doc.createdAt,
});

const isDuplicateKey = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
