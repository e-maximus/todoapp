import React, { useReducer } from 'react';
import nanoid from 'nanoid'
import * as todoReducer from './stores/todo'

import styles from './App.module.scss';

function App() {

  const [state, dispatch] = useReducer(todoReducer.reducer, todoReducer.initialState())

  return (
    <div className={styles.appContainer}>
      {
        state.todoList.map((todo) => {
          return (
            <div className={styles.todo + ' ' + todo.status} key={todo.id} onClick={() => {
              dispatch({type: todoReducer.ACTION_TOGGLE_STATUS, todoId: todo.id})
            }}>
              {todo.title}
            </div>
          )
        })
      }
      <button onClick={() => {
        dispatch({type: todoReducer.ACTION_ADD, todo: {title: 'Title ' + Date.now(), createdAt: new Date(), id: nanoid(), status: todoReducer.STATUS_ACTIVE}})
      }} >Add new todo</button>
    </div>
  );
}

export default App;
