import React, { SyntheticEvent } from 'react'
import { Moment } from 'moment'
import { Form, Input, DatePicker, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form';

interface todoFormValues {
  title: string,
  dueTo?: Moment
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

interface OwnProps extends FormComponentProps {
  onSubmit: (values: todoFormValues) => void
}

const hasErrors = (fieldsError: any) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class TodoForm extends React.PureComponent<OwnProps> {
  componentDidMount() {
    this.props.form.validateFields()
  }

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.props.onSubmit(values)
        this.props.form.resetFields()
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    const usernameError = isFieldTouched('title') && getFieldError('title')
    const passwordError = isFieldTouched('dueTo') && getFieldError('dueTo')
    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
      >
        <Form.Item
          validateStatus={usernameError ? 'error' : ''}
          help={usernameError || ''}
          label='Title'
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please add title!' }],
          })(
            <Input
              placeholder="New todo title"
            />,
          )}
        </Form.Item>
        <Form.Item
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
          label='Due to'
        >
          {getFieldDecorator('dueTo')(
            <DatePicker onChange={(e) => {console.log(e)}} />,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Add
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export const NewTodoForm = Form.create<OwnProps>({ name: 'newTodoForm' })(TodoForm)
