# Ant Design components, layout & theming (`@refinedev/antd`)

## Install

```bash
npm i @refinedev/antd antd
```

## App shell (required wiring)

```tsx
import { ConfigProvider, App as AntdApp } from "antd";
import { RefineThemes } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

<ConfigProvider theme={RefineThemes.Blue}>
  <AntdApp>
    {/* <Refine> and everything else */}
  </AntdApp>
</ConfigProvider>
```

Both wrappers are required, not just `ConfigProvider`: antd v5's static `message`/`notification`/`Modal` APIs need the `<App>` context to read theme tokens. Skipping `<AntdApp>` is the most common "notifications look unstyled" bug in this stack — see `references/gotchas.md`.

`RefineThemes` ships ready-made theme objects (`Blue`, `Purple`, `Magenta`, `Red`, `Orange`, `Yellow`) — start from one instead of hand-building a `ConfigProvider` theme.

## Layout

```tsx
import { ThemedLayoutV2, ThemedSiderV2, ThemedHeaderV2, ThemedTitleV2 } from "@refinedev/antd";

<ThemedLayoutV2
  Sider={() => <ThemedSiderV2 />}
  Header={() => <ThemedHeaderV2 />}
  Title={({ collapsed }) => <ThemedTitleV2 collapsed={collapsed} text="My App" />}
>
  <Outlet />
</ThemedLayoutV2>
```

Always import the **V2** family (`ThemedLayoutV2`/`ThemedSiderV2`/`ThemedHeaderV2`/`ThemedTitleV2`) — the plain `ThemedLayout` is deprecated. It renders header + sider (auto-generated nav from `resources`) + content, and shows a logout control when `authProvider` is present.

Customizing the sider/header (a "swizzle"): copy the default component's source and adjust, but keep `theme="dark"` on any custom `<Menu>` and don't hardcode a header background color — both fights with `ConfigProvider` theming otherwise (see `references/gotchas.md`).

## Notifications

```tsx
import { useNotificationProvider } from "@refinedev/antd";

<Refine notificationProvider={useNotificationProvider}>
```

Wires antd's own `message`/`notification` as Refine's notification provider — `successNotification`/`errorNotification` on any mutation hook now render as antd toasts with zero extra code. Requires `<AntdApp>` in the tree (see above).

## View wrapper components: `List` / `Create` / `Edit` / `Show`

Pre-built page chrome (title, breadcrumb, header actions) wrapping the actual `<Table>`/`<Form>` content. One per file, matching `pages/<resource>/{list,create,edit,show}.tsx`.

Notable props:
- `<List>` — `title`, `canCreate`, `createButtonProps`, `headerButtons={({ defaultButtons }) => (...)}` (compose with the default buttons instead of replacing them), `breadcrumb`.
- `<Create>` / `<Edit>` — `saveButtonProps` (from `useForm`), `title`, `canDelete` + `deleteButtonProps` (Edit only), `footerButtons` (used by `useStepsForm` for prev/next/save).
- `<Show>` — `isLoading`.

## Buttons

`CreateButton`, `EditButton`, `ShowButton`, `CloneButton`, `DeleteButton`, `ListButton`, `RefreshButton`, `SaveButton`, `ImportButton`, `ExportButton`. Shared prop vocabulary: `resource`, `recordItemId`, `hideText`, `size`, `accessControl={{ enabled, hideIfUnauthorized }}`. `DeleteButton` additionally: `confirmTitle`, `confirmOkText`, `confirmCancelText`, `mutationMode`, `onSuccess`.

```tsx
<EditButton hideText size="small" recordItemId={record.id} />
<DeleteButton hideText size="small" recordItemId={record.id} accessControl={{ hideIfUnauthorized: true }} />
```

Reach for these instead of hand-rolled `<Button onClick={...navigate...}>` — they already carry navigation, loading state, and access-control wiring.

## Fields

Thin antd-styled renderers, all taking a `value` prop, used inside `Table.Column`'s `render` or a `<Show>` body: `TagField`, `TextField`, `NumberField`, `DateField`, `EmailField`, `BooleanField`, `UrlField`, `ImageField`, `FileField`, `MarkdownField`.

```tsx
<Table.Column dataIndex="status" title="Status" render={(value) => <TagField value={value} />} />
```

## Auth pages

```tsx
<AuthPage type="login" />
<AuthPage type="register" />
<AuthPage type="forgotPassword" />
<AuthPage type="updatePassword" />
```

Pre-styled, ready to drop into a public route group — see `templates/app-bootstrap.tsx` for the full routing pattern (including `CatchAllNavigate`/`NavigateToResource` so an already-authenticated user hitting `/login` gets redirected instead of shown the form).

## Theming

```tsx
<ConfigProvider theme={RefineThemes.Blue}>...</ConfigProvider>

// custom tokens/components
<ConfigProvider theme={{
  components: { Button: { borderRadius: 0 } },
  token: { colorPrimary: "#f0f" },
}}>

// dark/light toggle (antd's own algorithms)
<ConfigProvider theme={{
  algorithm: currentTheme === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
}}>
```

Prefer starting from a `RefineThemes` preset and layering `token`/`components` overrides on top, rather than building a theme object from scratch.
