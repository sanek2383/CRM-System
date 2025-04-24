import { useState } from "react"
import { TodoItem } from "../types/todo"
import {
  deleteFetchTodos,
  changeTodoStatus,
  editFetchTodos,
} from "../api/apiTodo"
import styles from "./Todo.module.css"
import iconWriting from "../../public/icon-writing-1.png"
import iconRecycleBin from "../../public/icon-recycle-bin.png"

interface TodoProps {
  todo: TodoItem
  reloadTodos: () => void
}

const Todo: React.FC<TodoProps> = ({ todo, reloadTodos }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)


  const deleteTodoHandler = async (id: number) => {
    try {
      await deleteFetchTodos(id)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при удалении задачи:" + error)
    }
  }

  const editTodoHandler = async (id: number) => {
    if (todo.id !== id) return
    try {
      setIsEdit(true)
      setEditText(todo.title)
    } catch (error) {
      alert("Ошибка при редактировании задачи:" + error)
    }
  }

  const saveEditHandler = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedText = editText.trim()

    if (trimmedText.length <= 2) {
      setEditError("Текст должен содержать больше 2 символов.")
      return
    }

    if (trimmedText.length > 64) {
      setEditError("Текст должен быть короче 64 символов.")
      return
    }
    try {
      await editFetchTodos(todo.id, trimmedText)

      setIsEdit(false)
      setEditError(null)

      reloadTodos()
    } catch (error) {
      alert("Ошибка при сохранении задачи:" + error)
    }
  }

  const cancelEditHandler = () => {
    setIsEdit(false)
    reloadTodos()
    setEditError(null)
  }

  const checkTodoHandler = async () => {
    try {
      await changeTodoStatus(todo.id, !todo.isDone)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при check задачи:" + error)
    }
  }

  return (
    <>
      <div className={styles.todo}>
        <div className={styles.todoText}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={todo.isDone}
            onChange={checkTodoHandler}
          />

          {isEdit? (
            <form onSubmit={saveEditHandler}>
              <input
                type="text"
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value)
                  if (editError) setEditError(null)
                }}
                autoFocus
              />
              <button
                className={styles.saveButton}
                type="submit"
              >
                Сохранить
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={cancelEditHandler}
              >
                Отмена
              </button>
            </form>
          ) : (
            <span className={todo.isDone ? styles.completedTodo : ""}>
              {todo.title}
            </span>
          )}
        </div>

        {!isEdit && (
          <button
            className={styles.writingButton}
            onClick={() => editTodoHandler(todo.id)}
          >
            <img
              src={iconWriting}
              alt="Редактировать"
            />
          </button>
        )}

        <button
          className={styles.deleteButton}
          onClick={() => deleteTodoHandler(todo.id)}
        >
          <img
            src={iconRecycleBin}
            alt="Удалить"
          />
        </button>
      </div>
      {isEdit && editError && (
        <p style={{ color: "red", margin: "5px 0 0 0" }}>{editError}</p>
      )}
    </>
  )
}

export default Todo
