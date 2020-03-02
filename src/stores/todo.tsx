import nanoid from 'nanoid'
import Moment, { Moment as MomentType } from 'moment'

export const STATUS_ACTIVE = 'active'
export const STATUS_DONE = 'done'

export const ACTION_ADD = 'add'
export const ACTION_EDIT = 'edit'
export const ACTION_TOGGLE_STATUS = 'toggleStatus'
export const ACTION_DELETE = 'delete'
export const ACTION_LOAD_STATE = 'load'

export interface todo {
  title: string,
  createdAt: MomentType | string,
  id: string,
  status: 'active' | 'done',
  dueTo?: MomentType | string
}

export interface stateInterface {
  todoList: Array<todo>,
  initialLoaded: false
}

export const defaultState = (): stateInterface => ({
  todoList: [],
  initialLoaded: false
})

export const initialState = (): stateInterface => ({
  todoList: sortedArray([
    {title: 'Watch this awesome app!', createdAt: Moment(), id: nanoid(), status: STATUS_ACTIVE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Install node_modules ' + nanoid(), createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
    {title: 'Run this app', createdAt: Moment(), id: nanoid(), status: STATUS_DONE},
  ]),
  initialLoaded: false
})

const sortTodo = (sortField = 'title') => (a: any | todo, b: any | todo): number => {
  switch (true) {
    case a[sortField] > b[sortField]:
      return 1
    case a[sortField] < b[sortField]:
      return -1
    default:
      return 0
  }
}

const sortedArray = (array: Array<todo>) => {
  return array.sort(sortTodo())
}

// @todo add interface for actions
export function reducer (state: stateInterface, action: any): stateInterface {
  console.log('Action: ', JSON.stringify(action))

  switch (action.type) {
    case ACTION_ADD:
      return {
        ...state,
        todoList: sortedArray([...state.todoList, action.todo])
      }
    case ACTION_DELETE:
      return {
        ...state,
        todoList: state.todoList.filter((todo: todo) => todo.id !== action.todoId)
      }
    case ACTION_TOGGLE_STATUS:
    case ACTION_EDIT:
      const certainTodo = state.todoList.find((todo: todo) => todo.id === action.todoId)
      if (certainTodo === undefined) {
        //eslint-disable-next-line
        console.warn('Cant find todo by id ' + action.todoId)
        return {
          ...state
        }
      }

      const editData = action.type === ACTION_TOGGLE_STATUS ? {
        status: certainTodo.status === STATUS_ACTIVE ? STATUS_DONE : STATUS_ACTIVE
      } : {...action.todo}

      return {
        ...state,
        todoList: sortedArray([
          ...state.todoList.filter((todo) => todo.id !== action.todoId),
          { ...certainTodo, ...editData }
        ])
      }
    case ACTION_LOAD_STATE:
      return {
        ...state,
        ...action.newState,
        initialLoaded: true
      }
    default:
      throw new Error('Unknown action')
  }
}

export const STORAGE_KEY = 'todo_app_storage'

export const storageConvertorMap: { [key: string]: (data: any) => any; } = {
  'todoList': function(data: Array<todo>) {
    if (!Array.isArray(data)) {
      return []
    }

    return data.map((todoItem) => {
      return {
        ...todoItem,
        dueTo: todoItem.dueTo ? Moment(todoItem.dueTo) : undefined,
        createdAt: todoItem.createdAt ? Moment(todoItem.createdAt) : undefined
      }
    })
  }
}

export function LocalStorageDecorator(reducer: any, keysToStore: Array<string> = ['todoList', 'initialLoaded']) {
  const filterState = (state: stateInterface) => {
    return Object.fromEntries(Object.entries(state).filter(([key]) => keysToStore.includes(key)))
  }

  return (state: stateInterface, action: any): stateInterface => {
    const newState = reducer(state, action)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filterState(newState)))
    return newState
  }
}
