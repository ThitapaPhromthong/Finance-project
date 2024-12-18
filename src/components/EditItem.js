import { Modal, Form, Select, Input, InputNumber, Button } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

export default function EditItem({ isOpen, item, onItemEdited, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue(item);
    }
  }, [isOpen, item]);

  const handleFormSubmit = () => {
    form.validateFields()
      .then((formData) => {
        onItemEdited(formData);
        form.resetFields();
      })
      .catch((info) => console.log('Validate Failed:', info));
  };

  return (
    <Modal
      title="Edit Transaction"
      open={isOpen}
      onOk={handleFormSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="ชนิด"
          rules={[{ required: true }]}
        >
          <Select
            allowClear
            options={[
              { value: 'income', label: 'รายรับ' },
              { value: 'expense', label: 'รายจ่าย' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="จำนวนเงิน"
          rules={[{ required: true }]}
        >
          <InputNumber placeholder="จำนวนเงิน" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="note"
          label="หมายเหตุ"
          rules={[{ required: true }]}
        >
          <Input placeholder="Note" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
