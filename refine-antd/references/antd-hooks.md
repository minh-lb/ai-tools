# Ant Design–flavored hooks (`@refinedev/antd`)

`@refinedev/antd` re-exports the core hooks under the same names, but returns props ready to spread straight onto antd components instead of raw state. **Always import these from `@refinedev/antd`, not `@refinedev/core`, inside antd pages** — the antd variants wrap the core ones, they don't replace them; anything not antd-specific (`useOne`, `useMany`, `useCustom`, auth hooks, ...) still comes from `@refinedev/core`.

## `useTable`

```tsx
import { useTable } from "@refinedev/antd";
import { Table } from "antd";

const { tableProps } = useTable<IPost>();

<Table {...tableProps} rowKey="id">
  <Table.Column dataIndex="id" title="ID" />
</Table>
```

`tableProps` carries `dataSource`, `loading`, `pagination`, `onChange` — sorting, filtering, and pagination all come from one spread. Options object is the same as core `useTable` (`resource`, `pagination`, `sorters`, `filters`, `syncWithLocation`, ...).

### Sorting

```tsx
import { getDefaultSortOrder } from "@refinedev/antd";

const { tableProps, sorters } = useTable<IPost>({
  sorters: { initial: [{ field: "id", order: "desc" }] },
});

<Table.Column
  dataIndex="id"
  title="ID"
  sorter={{ multiple: 2 }}
  defaultSortOrder={getDefaultSortOrder("id", sorters)}
/>
```

### Filtering

```tsx
import { FilterDropdown, getDefaultFilter } from "@refinedev/antd";
import { Radio } from "antd";

const { tableProps, filters } = useTable({
  filters: { initial: [{ field: "status", operator: "eq", value: "published" }] },
});

<Table.Column
  dataIndex="status"
  title="Status"
  defaultFilteredValue={getDefaultFilter("status", filters)}
  filterDropdown={(props) => (
    <FilterDropdown {...props}>
      <Radio.Group>
        <Radio value="published">Published</Radio>
        <Radio value="draft">Draft</Radio>
      </Radio.Group>
    </FilterDropdown>
  )}
/>
```

Date-range variant uses `rangePickerFilterMapper` + `DatePicker.RangePicker` (see `references/antd-components.md` for the full snippet if a task needs it).

### Relations in a table

```tsx
const { tableProps } = useTable<IPost>();
const categoryIds = tableProps.dataSource?.map((p) => p.category.id.toString()) ?? [];

const { data } = useMany<ICategory>({  // from @refinedev/core
  resource: "categories",
  ids: categoryIds,
  queryOptions: { enabled: categoryIds.length > 0 },
});
```

Render the looked-up category by matching `data?.data.find(c => c.id === record.category.id)` inside `Table.Column`'s `render`.

## `useForm`

```tsx
import { useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

const { formProps, saveButtonProps } = useForm<IPost>();

<Form {...formProps} layout="vertical">
  <Form.Item label="Title" name="title" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>
```

`action` (`create`/`edit`/`clone`) is inferred from the route. `saveButtonProps` spreads onto `<Create>`/`<Edit>`'s `saveButtonProps` (loading state + click handler wired to submit). Additional returns: `form` (antd `FormInstance`, for programmatic control), `query` (fetched record in edit/clone), `mutation`.

## `useSelect`

```tsx
import { useSelect } from "@refinedev/antd";
import { Select } from "antd";

const { selectProps } = useSelect<ICategory>({ resource: "categories" });

<Form.Item label="Category" name={["category", "id"]} rules={[{ required: true }]}>
  <Select {...selectProps} />
</Form.Item>
```

**Caveat:** `useSelect` only fetches data — it does not manage controlled `value`/`onChange` itself. Inside an antd `<Form.Item>`, the form handles binding automatically (works as shown). Used *outside* a `Form.Item`, wire `value`/`onChange` manually via `useState`.

Set `defaultValue` when editing a record whose related option might not be on the currently-fetched page — otherwise the label renders blank until the option is found.

## `useModalForm` / `useDrawerForm` / `useStepsForm`

All three build on `useForm`, adding a UI-shell prop bag. Pick based on interaction affordance:

| Hook | Shell | Best for |
|---|---|---|
| `useModalForm` | antd `<Modal>` | Quick create/edit without leaving the list |
| `useDrawerForm` | antd `<Drawer>` (slide-in panel) | Longer forms where side-panel space + visible list context both matter |
| `useStepsForm` | antd `<Steps>` wizard | One form logically split into sequential sections |

Full worked examples for each are in `templates/modal-form.tsx`, `templates/drawer-form.tsx`, `templates/steps-form.tsx` — copy the relevant one rather than re-deriving the plumbing, then adjust fields.

Quick shape reference:

```tsx
// useModalForm
const { modalProps, formProps, show } = useModalForm<IPost>({ action: "create" });
<List createButtonProps={{ onClick: () => show() }}>...</List>
<Modal {...modalProps}><Form {...formProps}>...</Form></Modal>

// useDrawerForm
const { drawerProps, formProps, show, saveButtonProps, id } = useDrawerForm<IPost>({ action: "edit" });
<EditButton onClick={() => show(record.id)} />
<Drawer {...drawerProps}><Edit saveButtonProps={saveButtonProps} recordItemId={id}><Form {...formProps}>...</Form></Edit></Drawer>

// useStepsForm
const { current, gotoStep, stepsProps, formProps, saveButtonProps } = useStepsForm<IPost>();
```

## `useCheckboxGroup` / `useRadioGroup`

Same idea as `useSelect` but for antd's `Checkbox.Group`/`Radio.Group` — fetch options from a resource, get back `{ checkboxGroupProps }` / `{ radioGroupProps }` to spread directly.

## Import/export

```tsx
import { useExport } from "@refinedev/core";
import { ExportButton, ImportButton, useImport } from "@refinedev/antd";

const { triggerExport, isLoading } = useExport<IPost>();
<List headerButtons={<ExportButton onClick={triggerExport} loading={isLoading} />}>...</List>

const importProps = useImport();
<ImportButton {...importProps}>Import</ImportButton>
```

`useImport`'s underlying `uploadProps` default to CSV-only, hide the file list, and disable auto-upload — override only if the task needs a different file type.
