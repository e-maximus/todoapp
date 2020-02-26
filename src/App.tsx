import React, { useReducer } from 'react';
import nanoid from 'nanoid'
import * as todoReducer from './stores/todo'
import { Card, Icon, Popconfirm } from 'antd'

import styles from './App.module.scss';

const { Meta } = Card

function App() {

  const [state, dispatch] = useReducer(todoReducer.reducer, todoReducer.initialState())

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
                placement="leftBottom"
                title={'Are you sure to delete this task?'}
                onConfirm={() => {
                  dispatch({type: todoReducer.ACTION_DELETE, todoId: todo.id})
                }}
                okText="Yes"
                cancelText="No"
              >
                <Icon type="delete" />
              </Popconfirm>
              ,
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
        onClick={() => {
        dispatch({type: todoReducer.ACTION_ADD, todo: {title: 'Title ' + Date.now(), createdAt: new Date(), id: nanoid(), status: todoReducer.STATUS_ACTIVE}})
      }}  />
    </div>
  );
}

export default App;
