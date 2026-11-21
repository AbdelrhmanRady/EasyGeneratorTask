import { z } from "zod";

const email = z
  .email("Enter a valid email address.")
  .trim()
  .min(1, "Email is required.");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.")
  .regex(/[A-Za-z]/, "Password must include at least one letter.")
  .regex(/\d/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters."),
  email,
  password,
});

export const signInSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must be at most 128 characters."),
});

export function fieldErrorsOf(error: z.ZodError) {
  const { fieldErrors } = z.flattenError(error);

  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      return message ? [[field, String(message)]] : [];
    }),
  );
}
