import React, {useMemo, SyntheticEvent} from 'react'
import * as todoReducer from '../stores/todo'
import {Card, Icon, Popconfirm} from 'antd';
import styles from '../App.module.scss';

const { Meta } = Card

interface TodoComponent {
  todo: todoReducer.todo,
  handleToggleClick: (todo: todoReducer.todo) => (e: SyntheticEvent) => void
  handleEdit: (todo: todoReducer.todo) => (e: SyntheticEvent) => void
  handleDelete: (todo: todoReducer.todo) => () => void
}

const Todo = ({ todo, handleToggleClick, handleEdit, handleDelete }: TodoComponent) => {
  return (
    <Card className={styles.todo + ' ' + todo.status} style={{marginTop: 20, minHeight: 150}} bodyStyle={{width: '100%'}} key={todo.id}>
      <Meta title={todo.title} className={styles.cardMeta} />
      {todo.dueTo && typeof todo.dueTo !== 'string' && <div className={styles.cardFooter}>
        {`due to: ${todo.dueTo.format('D MMMM')}`}
      </div>}
      <div className={styles.actionsPanel}>
        <div className={styles.actionWrapper}>
          <Icon type="check" style={{ fontSize: '20px' }} onClick={handleToggleClick(todo)} />
        </div>
        <div className={styles.actionWrapper}>
          <Icon type="edit" style={{ fontSize: '20px' }} onClick={handleEdit(todo)} />
        </div>
        <div className={styles.actionWrapper}>
          <Popconfirm
            placement="top"
            title={'Are you sure to delete this task?'}
            onConfirm={handleDelete(todo)}
            okText="Yes"
            cancelText="No"
          >
            <Icon type="delete" style={{ fontSize: '20px' }} />
          </Popconfirm>
        </div>
      </div>
    </Card>
  )
}

export default React.memo(Todo)
