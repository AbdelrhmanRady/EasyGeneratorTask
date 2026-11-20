import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import { Input } from "~/components/ui/Input";

export function SignUpForm() {
  return (
    <form className="flex flex-col gap-5" noValidate>
      <Field id="name" label="Name">
        <Input id="name" name="name" autoComplete="name" minLength={3} required />
      </Field>
      <Field id="email" label="Email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field
        id="password"
        label="Password"
        hint="At least 8 characters, with a letter, a number, and a special character."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <Button type="submit" className="mt-1 w-full">
        Create account
      </Button>
    </form>
  );
}
