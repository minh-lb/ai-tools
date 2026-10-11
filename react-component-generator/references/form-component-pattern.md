# Form Component Pattern

Load when a component collects user input and has validation or submission behavior. Follow the target application's installed form, schema, request, localization, and test conventions. This is not a reason to introduce a new form library.

## Choose the implementation

- Reuse an established form library and validation schema when the repository already uses one for comparable forms.
- If none exists, use the project's native/standard form approach for the actual complexity. Ask before adding dependencies or establishing a new form stack.
- Derive validation rules from approved product/API requirements. Do not invent required fields, format rules, length limits, or messages. Client validation supports usability; the server remains authoritative for validation, authorization, and data integrity.

## Form behavior

- Give each control a persistent accessible label; placeholders are not labels.
- Associate field errors with the corresponding controls and expose them in a way assistive technology can perceive. Provide a form-level message for submission/network failures when appropriate.
- Preserve user input when a recoverable error occurs, and do not show success until the outcome is confirmed.
- Prevent accidental duplicate submission when the operation is not safe to repeat; do not treat a disabled button as server-side idempotency.
- Use project-owned localized copy and existing pending/error states.

## Example: an established React Hook Form + Zod project

Use this pattern only when those packages and conventions already exist and the actual contract calls for the shown schema. The sample copy is illustrative.

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Replace with rules and user-facing copy from the approved contract/product.
const formSchema = z.object({
  email: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const useFormController = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = handleSubmit(async (values) => {
    // Call the project's existing mutation/action. Map known field errors safely;
    // show a generic approved message for unexpected server/network failures.
  });

  return { register, errors, isSubmitting, onSubmit };
};
```

Render the fields using the project's existing input/error components where available. Test with the project's runner and user-facing queries. If the controller is mocked in a component test, keep separate integration coverage for the real request boundary when the flow's risk warrants it.
