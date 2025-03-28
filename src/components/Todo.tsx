// import React from "react"
import { TodoProps } from "../assets/models/todo"
import styles from "./Todo.module.css"

const Todo: React.FC<TodoProps> = ({ todo, onDelete }) => {
  return (
    <div className={styles.todo}>
      <div className={styles.todoText}>{todo.text}</div>
      {onDelete && (
        <button 
          className={styles.deleteButton}
          onClick={onDelete}
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default Todo
