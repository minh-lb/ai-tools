import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import type { IPost, ICategory } from "./types";

export const PostCreate = () => {
  const { formProps, saveButtonProps } = useForm<IPost>();

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
    </Create>
  );
};
