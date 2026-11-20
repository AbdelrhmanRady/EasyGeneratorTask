import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className = "", invalid, ...props }: InputProps) {
  return (
    <input
      className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition-shadow placeholder:text-ink/40 focus:ring-2 focus:ring-accent/30 ${
        invalid
          ? "border-red-500 focus:ring-red-200"
          : "border-ink/15 focus:border-accent"
      } ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
