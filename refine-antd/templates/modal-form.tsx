/**
 * useModalForm template — quick create/edit inline on a list page, without
 * navigating away. See references/antd-hooks.md for when to prefer this over
 * useDrawerForm/useStepsForm.
 */
import { List, useTable, useModalForm } from "@refinedev/antd";
import { Table, Modal, Form, Input } from "antd";

interface IPost {
  id: number;
  title: string;
}

export const PostListWithModalCreate = () => {
  const { tableProps } = useTable<IPost>();

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: showCreateModal,
  } = useModalForm<IPost>({ action: "create" });

  return (
    <>
      <List createButtonProps={{ onClick: () => showCreateModal() }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="title" title="Title" />
        </Table>
      </List>

      <Modal {...createModalProps}>
        <Form {...createFormProps} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
