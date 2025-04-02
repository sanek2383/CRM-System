import { TodoProps } from "../assets/models/todo"
import styles from "./Todo.module.css"

const Todo: React.FC<TodoProps> = ({ todo, onDelete, checkTodo }) => {
  return (
    <div className={styles.todo}>
      <div
        className={`${styles.todoText} ${
          todo.isCompleted ? styles.completedTodo : ""
        }`}
      >
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.isCompleted}
          onChange={() => checkTodo(todo.id)}
        />
        {todo.text}
      </div>

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
