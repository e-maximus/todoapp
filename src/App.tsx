import React, { useReducer, useState, useEffect } from 'react';
import nanoid from 'nanoid'
import Moment from 'moment'
import * as todoReducer from './stores/todo'
import { NewTodoForm } from './components/NewTodoForm'
import { Card, Icon, Popconfirm, Modal, message } from 'antd'

import styles from './App.module.scss';

const { Meta } = Card
const storageReducer = todoReducer.LocalStorageDecorator(todoReducer.reducer)

function App() {

  const [state, dispatch] = useReducer(storageReducer, todoReducer.defaultState())
  const [newTodoVisible, setNewTodoVisible] = useState(false)
  const [editTodo, setEditTodo] = useState()

  useEffect(() => {
    const storageState = localStorage.getItem(todoReducer.STORAGE_KEY)
    const newState = typeof storageState === 'string' ? Object.fromEntries(Object.entries(JSON.parse(storageState)).map(([key, value]) => {
      return [key, todoReducer.storageConvertorMap[key] ? todoReducer.storageConvertorMap[key](value) : value]
    })) : todoReducer.initialState()
    dispatch({type: todoReducer.ACTION_LOAD_STATE, newState})
  }, [])

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
              <Icon type="edit" onClick={() => {
                setEditTodo(todo)
              }} />,
              <Popconfirm
                placement="top"
                title={'Are you sure to delete this task?'}
                onConfirm={() => {
                  dispatch({type: todoReducer.ACTION_DELETE, todoId: todo.id})
                  message.success('Task has been deleted')
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
          dispatch({type: todoReducer.ACTION_ADD, todo: {createdAt: Moment(), id: nanoid(), status: todoReducer.STATUS_ACTIVE, ...values}})
          setNewTodoVisible(false)
          message.success('New task added')
        }} />
      </Modal>

      <Modal
        title={'Edit todo "' + (editTodo ? editTodo.title.length > 20 ? editTodo.title.substring(20) + '..' : editTodo.title : '') + '"'}
        visible={!!editTodo}
        footer={null}
        onCancel={() => {setEditTodo(null)}}
      >
        <NewTodoForm
          onSubmit={(values) => {
            message.success('Task edited')
            setEditTodo(null)
            dispatch({type: todoReducer.ACTION_EDIT, todoId: editTodo.id, todo: {...editTodo, ...values}})
          }}
          editTodo={editTodo}
        />
      </Modal>
    </div>
  );
}

export default App;
