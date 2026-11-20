import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import { Input } from "~/components/ui/Input";

export function SignInForm() {
  return (
    <form className="flex flex-col gap-5" noValidate>
      <Field id="email" label="Email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Button type="submit" className="mt-1 w-full">
        Sign in
      </Button>
    </form>
  );
}
