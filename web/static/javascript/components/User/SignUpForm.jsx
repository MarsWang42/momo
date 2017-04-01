import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Alert,
} from 'antd';

const FormItem = Form.Item;

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, onFormSubmit, hideSignUpModal } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onFormSubmit(values, hideSignUpModal);
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const agreementItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10, offset: 7 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 2,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              First Name&nbsp;
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('first_name', {
            rules: [{ required: true, message: 'Please input your first name!', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Last Name&nbsp;
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('last_name', {
            rules: [{ required: true, message: 'Please input your last name!', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }, {
              min: 6,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
          hasFeedback
        >
          {getFieldDecorator('password_confirmation', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }, {
              min: 6, message: 'Password has to be at least 6 characters.',
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...agreementItemLayout} style={{ marginBottom: 8 }}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
            rules: [{
              required: true, message: 'Please read the agreement!',
            }],
          })(
            <Checkbox>I have read the <a>agreement</a></Checkbox>
          )}
        </FormItem>
        {
          this.props.signUpError && this.props.signUpError.email &&
          <Alert message={`Your Email ${this.props.signUpError.email}`} type="error" />
        }
        {
          this.props.signUpError && this.props.signUpError.password &&
          <Alert message={`Your Email ${this.props.signUpError.password}`} type="error" />
        }
        {
          this.props.signUpError && this.props.signUpError.username &&
          <Alert message={`Your Email ${this.props.signUpError.username}`} type="error" />
        }
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" className="register-form-button">Register</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSignUpForm = Form.create()(SignUpForm);

export default WrappedSignUpForm;
