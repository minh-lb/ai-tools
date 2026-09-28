/**
 * Edit page template — same field shape as create; useForm infers
 * action="edit" and the record id from the route automatically.
 */
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

interface IPost {
  title: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
}

interface ICategory {
  id: number;
  title: string;
}

export const PostEdit = () => {
  const { formProps, saveButtonProps } = useForm<IPost>();

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
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
      </Form>
    </Edit>
  );
};
