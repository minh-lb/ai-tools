/**
 * useDrawerForm template — edit-in-place via a side panel, keeping list
 * context visible. Swap action: "create" for a create-drawer variant (drop
 * the `show(record.id)` argument and the recordItemId prop).
 */
import { List, Show, useTable, useDrawerForm, EditButton } from "@refinedev/antd";
import { Table, Drawer, Form, Input, Space } from "antd";

interface IPost {
  id: number;
  title: string;
}

export const PostListWithDrawerEdit = () => {
  const { tableProps } = useTable<IPost>();

  const { formProps, drawerProps, show, saveButtonProps, id } = useDrawerForm<IPost>({
    action: "edit",
    warnWhenUnsavedChanges: true,
  });

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="title" title="Title" />
          <Table.Column<IPost>
            title="Actions"
            render={(_, record) => (
              <Space>
                <EditButton hideText size="small" onClick={() => show(record.id)} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Drawer {...drawerProps}>
        <Show isLoading={false} recordItemId={id} headerButtons={() => null}>
          <Form {...formProps} layout="vertical">
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Show>
      </Drawer>
    </>
  );
};

// Note: saveButtonProps should be wired to a Save button in the drawer footer
// (e.g. via <Drawer extra={<SaveButton {...saveButtonProps} />}>) — omitted
// above only to keep the Show wrapper simple; add it back for a real page.
