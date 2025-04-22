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
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>
  reloadTodos: () => void
}

const Todo: React.FC<TodoProps> = ({ todo, setTodo, reloadTodos }) => {
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)

  const isEditing = editId === todo.id

  const deleteTodoHandler = async (id: number) => {
    try {
      await deleteFetchTodos(id)
      setTodo((prevTodos) => prevTodos.filter((item) => item.id !== id))
      reloadTodos()
    } catch (error) {
      alert("Ошибка при удалении задачи:" + error)
    }
  }

  const editTodoHandler = async (id: number) => {
    if (todo.id !== id) return
    try {
      setEditId(id)
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
      setTodo((prevTodos) =>
        prevTodos.map((item) =>
          item.id === todo.id ? { ...item, title: trimmedText } : item
        )
      )
      setEditId(null)
      setEditText("")
      setEditError(null)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при сохранении задачи:" + error)
    }
  }

  const cancelEditHandler = () => {
    setEditId(null)
    setEditText("")
    setEditError(null)
  }

  const checkTodoHandler = async () => {
    try {
      await changeTodoStatus(todo.id, !todo.isDone)
      setTodo((prevTodos) =>
        prevTodos.map((item) =>
          item.id === todo.id ? { ...item, isDone: !item.isDone } : item
        )
      )
      reloadTodos()
    } catch (error) {
      alert("Ошибка при check задачи:" + error)
    }
  }

  return (
    <>
      <div className={styles.todo}>
        <div
          className={styles.todoText}
        >
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={todo.isDone}
            onChange={checkTodoHandler}
          />

          {isEditing ? (
            <form onSubmit={saveEditHandler}>
              <input
                type="text"
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value)
                  if (editError) setEditError(null)
                }}
              className={`${
                todo.isDone ? styles.completedTodo : ""
              }`}
                autoFocus
              />
              <button
                className={styles.saveButton}
                type="submit"
              >
                Сохранить
              </button>
              <button
                className={styles.cancelButton}
                onClick={cancelEditHandler}
              >
                Отмена
              </button>
            </form>
          ) : (
            <span>{todo.title}</span>
          )}
        </div>
        <div>
          <button
            className={styles.writingButton}
            onClick={() => editTodoHandler(todo.id)}
          >
            <img
              src={iconWriting}
              alt="Редактировать"
            />
          </button>
          <div/>
        </div>

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
      {isEditing && editError && (
        <p style={{ color: "red", margin: "5px 0 0 0" }}>{editError}</p>
      )}
    </>
  )
}

export default Todo
