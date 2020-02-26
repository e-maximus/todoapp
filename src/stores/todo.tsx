import nanoid from 'nanoid'
import { Moment } from 'moment'

export const STATUS_ACTIVE = 'active'
export const STATUS_DONE = 'done'

export const ACTION_ADD = 'add'
export const ACTION_TOGGLE_STATUS = 'toggleStatus'
export const ACTION_DELETE = 'delete'

export interface todo {
  title: string,
  createdAt: Date,
  id: string,
  status: 'active' | 'done',
  dueTo?: Moment
}

export interface stateInterface {
  todoList: Array<todo>
}

export const initialState = (): stateInterface => ({
  todoList: sortedArray([
    {title: 'Watch this awesome app!', createdAt: new Date(), id: nanoid(), status: STATUS_ACTIVE},
    {title: 'Install node_modules', createdAt: new Date(), id: nanoid(), status: STATUS_DONE},
    {title: 'Run this app', createdAt: new Date(), id: nanoid(), status: STATUS_DONE},
  ])
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


export function reducer (state: stateInterface, action: any) {
  switch (action.type) {
    case ACTION_ADD:
      return {
        todoList: sortedArray([...state.todoList, action.todo])
      }
    case ACTION_DELETE:
      return {
        todoList: state.todoList.filter((todo: todo) => todo.id !== action.todoId)
      }
    case ACTION_TOGGLE_STATUS:
      const certainTodo = state.todoList.find((todo: todo) => todo.id === action.todoId)
      if (certainTodo === undefined) {
        //eslint-disable-next-line
        console.warn('Cant find todo by id ' + action.todoId)
        return {
          ...state
        }
      }

      return {
        todoList: sortedArray([
          ...state.todoList.filter((todo) => todo.id !== action.todoId),
          { ...certainTodo, status: certainTodo.status === STATUS_ACTIVE ? STATUS_DONE : STATUS_ACTIVE}
        ])
      }
    default:
      throw new Error('Unknown action')
  }
}
