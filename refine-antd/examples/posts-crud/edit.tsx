import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import type { IPost, ICategory } from "./types";

export const PostEdit = () => {
  const { formProps, saveButtonProps, query } = useForm<IPost>();
  const postData = query?.data?.data;

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
    optionLabel: "title",
    optionValue: "id",
    defaultValue: postData?.category.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Category" name={["category", "id"]} rules={[{ required: true }]}>
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
