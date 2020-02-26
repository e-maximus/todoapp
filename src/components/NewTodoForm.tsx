import React, { SyntheticEvent } from 'react'
import { Moment } from 'moment'
import { Form, Input, DatePicker, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form';
import { todo, STATUS_DONE, STATUS_ACTIVE } from '../stores/todo';

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
  onSubmit: (values: todoFormValues) => void,
  editTodo?: todo,
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
        if (values.status !== undefined) {
          values.status = values.status === true ? STATUS_DONE : STATUS_ACTIVE
        }
        this.props.onSubmit(values)
        this.props.form.resetFields()
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const { editTodo } = this.props

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
            initialValue: editTodo ? editTodo.title : ''
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
          {getFieldDecorator('dueTo', {
            initialValue: editTodo ? editTodo.dueTo : undefined
          })(
            <DatePicker onChange={(e) => {console.log(e)}} />,
          )}
        </Form.Item>
        {editTodo && <Form.Item
          label='Created at'
        >
          {getFieldDecorator('createdAt', {
            initialValue: editTodo ? editTodo.createdAt : undefined
          })(
            <Input
              placeholder="New todo title"
              readOnly
            />
          )}
        </Form.Item>}
        {editTodo && <Form.Item
          label='Done'
        >
          {getFieldDecorator('status', {
            initialValue: editTodo ? editTodo.status === STATUS_DONE : false
          })(
            <Checkbox
              defaultChecked={editTodo ? editTodo.status === STATUS_DONE : false}
            />
          )}
        </Form.Item>}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            {editTodo ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export const NewTodoForm = Form.create<OwnProps>({ name: 'newTodoForm' })(TodoForm)
