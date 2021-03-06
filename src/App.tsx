import React, {useReducer, useState, useEffect, useCallback, SyntheticEvent} from 'react';
import nanoid from 'nanoid'
import Moment from 'moment'
import * as todoReducer from './stores/todo'
import { NewTodoForm } from './components/NewTodoForm'
import Todo from './components/Todo'
import { Icon, Modal, message } from 'antd'

import styles from './App.module.scss';

const storageReducer = todoReducer.LocalStorageDecorator(todoReducer.reducer)
const today = Moment()

function App() {

  const [state, dispatch] = useReducer(storageReducer, todoReducer.defaultState())
  const [newTodoVisible, setNewTodoVisible] = useState(false)
  const [editTodo, setEditTodo] = useState()

  const listHandler = useCallback((e: any) => {
    // console.log(e, e.nativeEvent.path)
    const eventIcon = e.nativeEvent.path.find((element: HTMLElement) => element.matches && element.matches('.eventIcon'))
    // console.log('eventIcon: ', eventIcon)
    if (!eventIcon) {
      //eslint-disable-next-line
      console.warn('cant find event icon')
      return
    }

    const eventDataset = eventIcon.dataset
    const eventActionType = eventDataset.eventType

    switch (eventActionType) {
      case todoReducer.ACTION_TOGGLE_STATUS:
        // console.log('Toggle action')
        dispatch({type: todoReducer.ACTION_TOGGLE_STATUS, todoId: eventDataset.id})
        e.preventDefault()
        break;
      case todoReducer.ACTION_EDIT:
        console.log('Toggle edit: ', eventDataset.id)
        const todo = state.todoList.find((t: todoReducer.todo) => t.id === eventDataset.id)
        if (!todo) {
          //eslint-disable-next-line
          console.warn('Cant find todo by id ' + eventDataset.id)
          return
        }
        console.log(todo)
        setEditTodo(todo)
        e.preventDefault()
        break;
      default:
        //eslint-disable-next-line
        console.warn('Unknown action type')
        break;
    }
   }, [state])

  useEffect(() => {
    const storageState = localStorage.getItem(todoReducer.STORAGE_KEY)
    const newState = typeof storageState === 'string' ? Object.fromEntries(Object.entries(JSON.parse(storageState)).map(([key, value]) => {
      return [key, todoReducer.storageConvertorMap[key] ? todoReducer.storageConvertorMap[key](value) : value]
    })) : todoReducer.initialState()
    dispatch({type: todoReducer.ACTION_LOAD_STATE, newState})
  }, [])

  const handleDelete = useCallback((todo: todoReducer.todo) => () => {
    dispatch({type: todoReducer.ACTION_DELETE, todoId: todo.id})
    message.success('Task has been deleted')
  }, [])

  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        {today.format('D MMM, dddd')}
      </div>
      <div className={styles.todoListWrapper} onClick={listHandler}>
        {
          state.todoList.map((todo) => {
            return <Todo
              key={todo.id}
              todo={todo}
              handleDelete={handleDelete}
            />
          })
        }
      </div>
      <Icon
        type="plus-circle"
        title='Add new todo task'
        className={styles.iconNewTodo}
        style={{ fontSize: '70px', color: '#1fcc7c' }}
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
        title={'Edit todo "' + (editTodo ? (editTodo.title.length > 20 ? editTodo.title.substring(0, 20) + '..' : editTodo.title) : '') + '"'}
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
