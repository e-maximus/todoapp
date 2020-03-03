import React from 'react'
import * as todoReducer from '../stores/todo'
import {Card, Icon, Popconfirm} from 'antd';
import styles from '../App.module.scss';

const { Meta } = Card

interface TodoComponent {
  todo: todoReducer.todo,
  handleDelete: (todo: todoReducer.todo) => () => void
}

const Todo = ({ todo, handleDelete }: TodoComponent) => {
  return (
    <Card className={styles.todo + ' ' + todo.status} style={{marginTop: 20, minHeight: 150}} bodyStyle={{width: '100%'}} key={todo.id}>
      <Meta title={todo.title} className={styles.cardMeta} />
      {todo.dueTo && typeof todo.dueTo !== 'string' && <div className={styles.cardFooter}>
        {`due to: ${todo.dueTo.format('D MMMM')}`}
      </div>}
      <div className={styles.actionsPanel}>
        <div className={styles.actionWrapper}>
          <Icon className='eventIcon' type="check" style={{ fontSize: '20px' }} data-event-type={todoReducer.ACTION_TOGGLE_STATUS} data-id={todo.id} />
        </div>
        <div className={styles.actionWrapper}>
          <Icon className='eventIcon' type="edit" style={{ fontSize: '20px' }} data-event-type={todoReducer.ACTION_EDIT} data-id={todo.id} />
        </div>
        <div className={styles.actionWrapper}>
          <Popconfirm
            placement="top"
            title={'Are you sure to delete this task?'}
            onConfirm={handleDelete(todo)}
            okText="Yes"
            cancelText="No"
          >
            <Icon className='eventIcon' type="delete" data-event-type={todoReducer.ACTION_DELETE} data-id={todo.id} style={{ fontSize: '20px' }} />
          </Popconfirm>
        </div>
      </div>
    </Card>
  )
}

export default React.memo(Todo)
