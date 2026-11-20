import { signInSchema, signUpSchema } from './auth.schemas.js';

const valid = {
  email: 'ada@example.com',
  name: 'Ada',
  password: 'Password1!',
};

describe('signUpSchema', () => {
  it('accepts a valid sign-up', () => {
    expect(signUpSchema.parse(valid)).toEqual(valid);
  });

  it('rejects a short name', () => {
    expect(signUpSchema.safeParse({ ...valid, name: 'Al' }).success).toBe(false);
  });

  it('rejects a password without a special character', () => {
    expect(signUpSchema.safeParse({ ...valid, password: 'Password1' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(signUpSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('accepts any non-empty password', () => {
    expect(signInSchema.parse({ email: valid.email, password: 'old' })).toEqual({
      email: valid.email,
      password: 'old',
    });
  });
});
