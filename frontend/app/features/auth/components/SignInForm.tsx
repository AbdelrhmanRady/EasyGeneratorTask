import { Form, useNavigation } from "react-router";
import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import { FormError } from "~/components/ui/FormError";
import { Input } from "~/components/ui/Input";
import type { AuthFormResult } from "../types";

type SignInFormProps = {
  result?: AuthFormResult<"email" | "password">;
};

export function SignInForm({ result }: SignInFormProps) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const errors = result?.fieldErrors;

  return (
    <Form className="flex flex-col gap-5" method="post" noValidate>
      <FormError message={result?.formError} />
      <Field id="email" label="Email" error={errors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={result?.values?.email}
          invalid={Boolean(errors?.email)}
          aria-describedby={errors?.email ? "email-error" : undefined}
        />
      </Field>
      <Field id="password" label="Password" error={errors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          required
          invalid={Boolean(errors?.password)}
          aria-describedby={errors?.password ? "password-error" : undefined}
        />
      </Field>
      <Button type="submit" className="mt-1 w-full" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </Form>
  );
}
