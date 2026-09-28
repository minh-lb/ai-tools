# Form Component Pattern

Use this reference when the component being generated collects user input and needs validation + submission (login form, settings form, search filters with validated fields, etc.). Not needed for a single uncontrolled input with no validation — plain `useState`/`controller.ts` is enough for that.

## Default stack

**React Hook Form + Zod** (via `@hookform/resolvers/zod`) is the default choice for new form components. Before generating, check `package.json` for an existing form library (Formik, `react-final-form`, `remix-validated-form`, etc.) — if the repo already has an established choice, follow it instead of introducing a second one.

## File layout

A form component always gets a `controller.ts` — form state (`useForm`) is a hook, so it never stays in `index.tsx`. Follow the standard controller conventions in `references/component-authoring-reference.md`: all form logic lives in `controller.ts`, `index.tsx` stays pure render/composition.

## controller.ts

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export const useController = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = handleSubmit(async (values) => {
    // Add real submit behavior here (API call, server action, etc.).
    // Map backend field-level errors into the relevant form fields
    // if the request can return them.
  });

  return { register, errors, isSubmitting, onSubmit };
};
```

## index.tsx

```tsx
"use client";

import { useController } from "./controller";

const LoginForm = () => {
  const { register, errors, isSubmitting, onSubmit } = useController();

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Log in"}
      </button>
    </form>
  );
};

export default LoginForm;
```

## Conventions specific to forms

- Schema lives in `controller.ts` next to the hook that uses it. Only hoist it to a shared `schemas/` file when the same schema is genuinely reused by another component (not defensively).
- Export the inferred type (`export type FormValues = z.infer<typeof formSchema>`) only if something outside `controller.ts` needs it — same "don't export by default" rule as `Props` (see `references/component-authoring-reference.md`).
- Every input needs an associated `<label htmlFor>` — no placeholder-only labeling.
- Render field errors next to their field, `role="alert"`, driven by `formState.errors.<field>`, not a single top-level error blob — this is what lets a screen reader announce the specific failing field.
- Disable the submit control while `isSubmitting`; don't hand-roll a separate `isLoading` state next to it — React Hook Form already tracks this.
- If the same submission handler needs to surface a server-side/network error (not a per-field validation error), track that separately (e.g. from the controller's async submit) and render it as a form-level alert above the fields — don't force it into `formState.errors`, which is reserved for schema/field validation.
- Testing: query fields with `getByLabelText`, submit with `user.click(getByRole('button', { name: /submit/i }))`, and assert on the rendered error text — not on `formState` internals (test behavior, not implementation details).
