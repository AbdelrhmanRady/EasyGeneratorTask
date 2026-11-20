const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER = /[A-Za-z]/;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export const passwordRules = {
  minLength: 8,
  hasLetter: true,
  hasNumber: true,
  hasSpecial: true,
} as const;

export const nameRules = {
  minLength: 3,
} as const;

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
}

export function validateName(value: string): string | undefined {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < nameRules.minLength) {
    return `Name must be at least ${nameRules.minLength} characters.`;
  }
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < passwordRules.minLength) {
    return `Password must be at least ${passwordRules.minLength} characters.`;
  }
  if (!HAS_LETTER.test(value)) return "Password must include at least one letter.";
  if (!HAS_NUMBER.test(value)) return "Password must include at least one number.";
  if (!HAS_SPECIAL.test(value)) {
    return "Password must include at least one special character.";
  }
}
