import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const signUpSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(3).max(100),
  password: passwordSchema,
});
export type SignUpDto = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});
export type SignInDto = z.infer<typeof signInSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  createdAt: z.iso.datetime(),
});

export const sessionResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
  expiresIn: z.number().int(),
  refreshToken: z.string(),
});

export const refreshedTokenResponseSchema = sessionResponseSchema.omit({ user: true });
