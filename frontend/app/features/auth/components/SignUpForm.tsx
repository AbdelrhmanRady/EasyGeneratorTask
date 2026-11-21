import { Form, useNavigation } from "react-router";
import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import { FormError } from "~/components/ui/FormError";
import { Input } from "~/components/ui/Input";
import type { AuthFormResult } from "../types";

type SignUpFormProps = {
  result?: AuthFormResult;
};

export function SignUpForm({ result }: SignUpFormProps) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const errors = result?.fieldErrors;

  return (
    <Form className="flex flex-col gap-5" method="post" noValidate>
      <FormError message={result?.formError} />
      <Field id="name" label="Name" error={errors?.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          minLength={3}
          maxLength={100}
          required
          defaultValue={result?.values?.name}
          invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? "name-error" : undefined}
        />
      </Field>
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
      <Field
        id="password"
        label="Password"
        error={errors?.password}
        hint="At least 8 characters, with a letter, a number, and a special character."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          invalid={Boolean(errors?.password)}
          aria-describedby={
            errors?.password ? "password-error" : "password-hint"
          }
        />
      </Field>
      <Button type="submit" className="mt-1 w-full" disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </Button>
    </Form>
  );
}
