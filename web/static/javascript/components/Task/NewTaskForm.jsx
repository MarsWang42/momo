import React from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
} from 'antd';

const FormItem = Form.Item;

class NewTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, onFormSubmit, listId, boardChannel, hideDropdown } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onFormSubmit(values, listId, boardChannel, hideDropdown);
      }
    });
  }

  isLoading() {
    const { isCreating, creatingError } = this.props;
    if (isCreating && !creatingError) return "validating";
    else if (creatingError) return "error";
    return "";
  }

  render() {
    const { form, creatingError } = this.props;
    const labelStyle = {
      fontSize: "15px",
      fontWeight: 500,
      marginBottom: "10px",
      display: "inline-block",
    };
    return (
      <Form onSubmit={this.handleSubmit} className="new-task-form">
        <label style={labelStyle}>Task Title: </label>
        <FormItem validateStatus={this.isLoading()} hasFeedback>
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input title for the new Task!' }],
          })(
            <Input autoFocus placeholder='Like "Write the syllabus"' />,
          )}
        </FormItem>
        <FormItem>
          {
            creatingError && (
              <Alert
                message="Error"
                description="Failed to create a new Task."
                type="error"
                closable
              />
            )
          }
          <Button type="primary" htmlType="submit" className="new-task-form-button">
            Create
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNewTaskForm = Form.create()(NewTaskForm);

export default WrappedNewTaskForm;
