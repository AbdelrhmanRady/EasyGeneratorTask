import { Types } from 'mongoose';
import { UsersRepository } from './users.repository.js';

describe('UsersRepository', () => {
  const createdAt = new Date('2026-01-01T00:00:00.000Z');
  const id = new Types.ObjectId();

  it('returns a user without the password hash', async () => {
    const model = {
      create: vi.fn(async () => ({
        _id: id,
        email: 'ada@example.com',
        name: 'Ada',
        passwordHash: 'hash',
        createdAt,
      })),
    };
    const repository = new UsersRepository(model as never);

    await expect(repository.create('  ADA@example.com ', ' Ada ', 'hash')).resolves.toEqual({
      id: id.toString(),
      email: 'ada@example.com',
      name: 'Ada',
      createdAt,
    });
    expect(model.create).toHaveBeenCalledWith({
      email: 'ada@example.com',
      name: 'Ada',
      passwordHash: 'hash',
    });
  });

  it('returns null when the email is already taken', async () => {
    const model = { create: vi.fn(async () => Promise.reject({ code: 11000 })) };
    const repository = new UsersRepository(model as never);

    await expect(repository.create('ada@example.com', 'Ada', 'hash')).resolves.toBeNull();
  });

  it('returns null for an id that is not an ObjectId', async () => {
    const model = { findById: vi.fn() };
    const repository = new UsersRepository(model as never);

    await expect(repository.findById('not-an-id')).resolves.toBeNull();
    expect(model.findById).not.toHaveBeenCalled();
  });
});
