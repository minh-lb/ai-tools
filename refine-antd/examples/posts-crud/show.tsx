import { Show, MarkdownField, TagField } from "@refinedev/antd";
import { Typography } from "antd";
import { useShow, useOne } from "@refinedev/core";
import type { IPost, ICategory } from "./types";

const { Title, Text } = Typography;

export const PostShow = () => {
  const {
    result: record,
    query: { isLoading },
  } = useShow<IPost>();

  const { result: category, query: categoryQuery } = useOne<ICategory>({
    resource: "categories",
    id: record?.category.id ?? "",
    queryOptions: { enabled: !!record },
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>

      <Title level={5}>Status</Title>
      <TagField value={record?.status} />

      <Title level={5}>Category</Title>
      <Text>{categoryQuery.isLoading ? "Loading..." : category?.title}</Text>

      <Title level={5}>Content</Title>
      <MarkdownField value={record?.content} />
    </Show>
  );
};
