/**
 * Show page template. useShow/useOne come from @refinedev/core (headless) —
 * only the page chrome (<Show>) and field renderers are antd-specific.
 */
import { Show, MarkdownField } from "@refinedev/antd";
import { Typography } from "antd";
import { useShow, useOne } from "@refinedev/core";

const { Title, Text } = Typography;

interface IPost {
  id: number;
  title: string;
  content: string;
  category: { id: number };
}

interface ICategory {
  id: number;
  title: string;
}

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
      <Title level={5}>Id</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>

      <Title level={5}>Category</Title>
      <Text>{categoryQuery.isLoading ? "Loading..." : category?.title}</Text>

      <Title level={5}>Content</Title>
      <MarkdownField value={record?.content} />
    </Show>
  );
};
