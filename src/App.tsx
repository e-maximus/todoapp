import React, { useReducer, useState } from 'react';
import nanoid from 'nanoid'
import * as todoReducer from './stores/todo'
import { NewTodoForm } from './components/NewTodoForm'
import { Card, Icon, Popconfirm, Modal, message } from 'antd'

import styles from './App.module.scss';

const { Meta } = Card

function App() {

  const [state, dispatch] = useReducer(todoReducer.reducer, todoReducer.initialState())
  const [newTodoVisible, setNewTodoVisible] = useState(false)

  console.log('Staete: ', JSON.stringify(state))

  return (
    <div className={styles.appContainer}>
      {
        state.todoList.map((todo) => {
          return (
            <Card className={styles.todo + ' ' + todo.status} style={{marginTop: 20}} key={todo.id}
            actions={[
              <Icon type="check" onClick={() => {
                dispatch({type: todoReducer.ACTION_TOGGLE_STATUS, todoId: todo.id})
              }} />,
              <Icon type="edit" />,
              <Popconfirm
                placement="top"
                title={'Are you sure to delete this task?'}
                onConfirm={() => {
                  dispatch({type: todoReducer.ACTION_DELETE, todoId: todo.id})
                }}
                okText="Yes"
                cancelText="No"
              >
                <Icon type="delete" />
              </Popconfirm>
            ]}>
              <Meta
                title={todo.title}
              />
            </Card>
          )
        })
      }
      <Icon
        type="plus-circle"
        title='Add new todo task'
        className={styles.iconNewTodo}
        style={{ fontSize: '100px', color: '#1fcc7c' }}
        onClick={() => {setNewTodoVisible(true)}} />
      <Modal
        title="New todo"
        visible={newTodoVisible}
        footer={null}
        onCancel={() => {setNewTodoVisible(false)}}
      >
        <NewTodoForm onSubmit={(values) => {
          dispatch({type: todoReducer.ACTION_ADD, todo: {createdAt: new Date(), id: nanoid(), status: todoReducer.STATUS_ACTIVE, ...values}})
          setNewTodoVisible(false)
          message.success('New task added')
        }} />
      </Modal>
    </div>
  );
}

export default App;
