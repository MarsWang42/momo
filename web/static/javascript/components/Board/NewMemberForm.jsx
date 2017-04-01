import React from 'react';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class NewMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, onFormSubmit, channel, hideBoardModal } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onFormSubmit(channel, values.email, hideBoardModal);
      }
    });
  }

  render() {
    const { form, addingMemberError } = this.props;

    const isLoading = () => {
      const { addingMemberError } = this.props;
      if (addingMemberError) return "error";
      return "";
    };

    return (
      <Form onSubmit={this.handleSubmit} className="add-member-form">
        <FormItem validateStatus={isLoading()} hasFeedback className="member-form-item">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: "email", message: "Please input new member's E-mail!" }],
          })(
            <Input prefix={<Icon type="mail" style={{ fontSize: 14 }} />} placeholder="user@example.com" />
          )}
        </FormItem>
        <FormItem className="member-form-item">
          <Button type="primary" size="small" htmlType="submit" className="member-form-button">
            Add a Member
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNewMemberForm = Form.create()(NewMemberForm);

export default WrappedNewMemberForm;
