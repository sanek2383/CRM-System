import { TodoProps } from "../assets/models/todo"
import styles from "./Todo.module.css"
import iconWriting from "../../public/icon-writing-1.png"
import iconRecycleBin from "../../public/icon-recycle-bin.png"

const Todo: React.FC<TodoProps> = ({
  todo,
  onDelete,
  checkTodo,
  editId,
  editText,
  setEditText,
  editTodo,
  saveEdit,
  cancelEdit,
  editError,
  setEditError,
}) => {
  const isEditing = editId === todo.id

  return (
    <>
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

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value)
              if (editError) setEditError(null)
            }}
            // onBlur={() => saveEdit(todo.id)}
            autoFocus
          />
        ) : (
          <span>{todo.text}</span>
        )}
      </div>

      {isEditing ? (
        <>
          <button
            className={styles.saveButton}
            onClick={() => saveEdit(todo.id)}
          >
            Сохранить
          </button>
          <button
            className={styles.cancelButton}
            onClick={cancelEdit}
          >
            Отмена
          </button>
        </>
      ) : (
        <button
          className={styles.writingButton}
          onClick={() => editTodo(todo.id)}
        >
          <img
            src={iconWriting}
            alt="Редактировать"
          />
        </button>
      )}

      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={onDelete}
        >
          <img
            src={iconRecycleBin}
            alt="Удалить"
          />
        </button>
      )}
    </div>
    {isEditing && editError && (
  <p style={{ color: "red", margin: "5px 0 0 0" }}>{editError}</p>
)}
    </>
  )
}

export default Todo
