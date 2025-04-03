import { TodoProps } from "../assets/models/todo"
import styles from "./Todo.module.css"

const Todo: React.FC<TodoProps> = ({
  todo,
  onDelete,
  checkTodo,
  editId,
  editText,
  setEditText,
  editTodo,
  saveEdit,
}) => {
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
        {editId === todo.id ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => saveEdit(todo.id)}
            autoFocus
          />
        ) : (
          <span onClick={() => editTodo(todo.id)}>{todo.text}</span>
        )}
      </div>

      <button className={styles.writingButton}>
        <img
          src="../../public/icon-writing-1.png"
          alt="icon"
          onClick={() => editTodo(todo.id)}
        />
      </button>

      {onDelete && (
        <button className={styles.deleteButton}>
          <img
            src="../../public/icon-recycle-bin.png"
            alt="icon"
            onClick={onDelete}
          />
        </button>
      )}
    </div>
  )
}

export default Todo
