/**
 * List page template. Replace IPost/"posts"/columns with the target resource.
 * See references/antd-hooks.md (useTable) and references/antd-components.md
 * (List, buttons, fields) for the pieces used here.
 */
import { List, useTable, EditButton, ShowButton, DeleteButton, TagField } from "@refinedev/antd";
import { Table, Space } from "antd";

interface IPost {
  id: number;
  title: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
}

export const PostList = () => {
  const { tableProps } = useTable<IPost>({
    sorters: { initial: [{ field: "id", order: "desc" }] },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" sorter />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => <TagField value={value} />}
        />
        <Table.Column<IPost>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
