/**
 * Full worked example: posts list with sorting, a status filter dropdown,
 * a resolved category relation column, and row actions. This combines every
 * table pattern documented in references/antd-hooks.md into one page —
 * use it as the reference shape for a real list page, trimming what a
 * simpler resource doesn't need.
 */
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  TagField,
  FilterDropdown,
  getDefaultSortOrder,
  getDefaultFilter,
} from "@refinedev/antd";
import { useMany } from "@refinedev/core";
import { Table, Space, Radio } from "antd";
import type { IPost, ICategory } from "./types";

export const PostList = () => {
  const { tableProps, sorters, filters } = useTable<IPost>({
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
    filters: { initial: [{ field: "status", operator: "eq", value: "published" }] },
  });

  const categoryIds = tableProps.dataSource?.map((post) => post.category.id.toString()) ?? [];
  const { result: categories } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: { enabled: categoryIds.length > 0 },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="ID"
          sorter={{ multiple: 2 }}
          defaultSortOrder={getDefaultSortOrder("id", sorters)}
        />
        <Table.Column
          dataIndex="title"
          title="Title"
          sorter={{ multiple: 1 }}
          defaultSortOrder={getDefaultSortOrder("title", sorters)}
        />
        <Table.Column
          dataIndex={["category", "id"]}
          title="Category"
          render={(categoryId: number) =>
            categories?.data.find((c) => c.id === categoryId)?.title ?? "Loading..."
          }
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          defaultFilteredValue={getDefaultFilter("status", filters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Radio.Group>
                <Radio value="published">Published</Radio>
                <Radio value="draft">Draft</Radio>
                <Radio value="rejected">Rejected</Radio>
              </Radio.Group>
            </FilterDropdown>
          )}
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
