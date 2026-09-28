# Auth provider & access control

Two separate concerns, two separate providers:

- **`authProvider`** — *authentication*: who is this user, are they logged in.
- **`accessControlProvider`** — *authorization*: can this user do this action on this resource.

Don't conflate them — a task like "hide the delete button from non-admins" is access control, not auth.

## `authProvider` interface

```typescript
login: async (params) => AuthActionResponse;      // { success, redirectTo?, error? }
check: async (params) => CheckResponse;           // { authenticated, redirectTo?, logout?, error? }
logout: async (params) => AuthActionResponse;
onError: async (error) => OnErrorResponse;        // { redirectTo?, logout?, error? } — called on any data-provider error

// optional
getPermissions: (params?) => Promise<unknown>;
getIdentity: async () => Promise<unknown>;
register: async (params) => AuthActionResponse;
forgotPassword: async (params) => AuthActionResponse;
updatePassword: async (params) => AuthActionResponse;
```

A full mock implementation (localStorage-backed, useful as a starting skeleton for a real one) is in `templates/auth-provider.ts`.

## Wiring + route protection

```tsx
import { Refine, Authenticated } from "@refinedev/core";
import { authProvider } from "./providers/auth-provider";

<Refine authProvider={authProvider}>
  <Authenticated key="protected" fallback={<Login />}>
    {/* protected content */}
  </Authenticated>
</Refine>
```

`<Authenticated>` calls `authProvider.check()` and renders `fallback` when unauthenticated. See `templates/app-bootstrap.tsx` for the full route-group pattern combining this with `@refinedev/antd`'s `<AuthPage>` and React Router.

Auth-related hooks (`useLogin`, `useLogout`, `useIsAuthenticated`, `useGetIdentity`, `usePermissions`, `useOnError`, `useRegister`, `useForgotPassword`, `useUpdatePassword`) call into whichever methods are implemented above — implement only what the app needs (e.g. skip `register`/`forgotPassword` if there's no self-service signup).

## `accessControlProvider` interface

```typescript
interface IAccessControlContext {
  can?: ({ resource, action, params }) => Promise<{ can: boolean; reason?: string }>;
  options?: {
    buttons?: { enableAccessControl?: boolean; hideIfUnauthorized?: boolean };
    queryOptions?: UseQueryOptions;
  };
}
```

Minimal implementation:

```typescript
const accessControlProvider: IAccessControlContext = {
  can: async ({ resource, action, params }) => ({ can: true }),
};
```

Usage:

```tsx
const { data } = useCan({ resource: "posts", action: "delete", params: { id: 1 } });

<CanAccess resource="posts" action="edit" params={{ id: 1 }} fallback={<CustomFallback />}>
  <YourComponent />
</CanAccess>
```

**`@refinedev/antd`'s action buttons** (`EditButton`, `DeleteButton`, `CreateButton`, ...) automatically respect `accessControlProvider` when `options.buttons.enableAccessControl` is on — set `accessControl={{ hideIfUnauthorized: true }}` on an individual button, or the global option, to hide (not just disable) actions a user can't perform. Prefer this over hand-rolled `{isAdmin && <Button/>}` conditionals once an `accessControlProvider` exists — it keeps the permission logic in one place.
