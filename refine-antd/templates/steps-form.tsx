/**
 * useStepsForm template — one form split into sequential sections navigated
 * by antd <Steps>. Add/remove entries in `formList` to change step count.
 */
import { Create, useStepsForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Steps, Button } from "antd";

interface IPost {
  title: string;
  category: { id: number };
  content: string;
}

interface ICategory {
  id: number;
  title: string;
}

export const PostCreateSteps = () => {
  const { current, gotoStep, stepsProps, formProps, saveButtonProps } =
    useStepsForm<IPost>();

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const formList = [
    <>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Category" name={["category", "id"]} rules={[{ required: true }]}>
        <Select {...categorySelectProps} />
      </Form.Item>
    </>,
    <>
      <Form.Item label="Content" name="content" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
    </>,
  ];

  return (
    <Create
      footerButtons={
        <>
          {current > 0 && <Button onClick={() => gotoStep(current - 1)}>Previous</Button>}
          {current < formList.length - 1 && (
            <Button onClick={() => gotoStep(current + 1)}>Next</Button>
          )}
          {current === formList.length - 1 && (
            <Button type="primary" {...saveButtonProps}>
              Save
            </Button>
          )}
        </>
      }
    >
      <Steps {...stepsProps} style={{ marginBottom: 24 }}>
        <Steps.Step title="About Post" />
        <Steps.Step title="Content" />
      </Steps>
      <Form {...formProps} layout="vertical">
        {formList[current]}
      </Form>
    </Create>
  );
};
