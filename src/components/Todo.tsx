import { TodoItem } from "../types/todo"
import {
  deleteFetchTodos,
  checkFetchTodos,
  editFetchTodos,
} from "../api/apiTodo"
import styles from "./Todo.module.css"
import iconWriting from "../../public/icon-writing-1.png"
import iconRecycleBin from "../../public/icon-recycle-bin.png"

interface TodoProps {
  todo: TodoItem
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>
  setEditId: React.Dispatch<React.SetStateAction<number | null>>
  editId: number | null
  editText: string
  setEditText: (text: string) => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

const Todo: React.FC<TodoProps> = ({
  todo,
  setTodo,
  setEditId,
  editId,
  editText,
  setEditText,
  editError,
  setEditError,
}) => {
  const isEditing = editId === todo.id

  const deleteTodoHandler = async (id: number) => {
    try {
      await deleteFetchTodos(id)
      setTodo((prevTodos) => prevTodos.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error)
    }
  }

  const editTodoHandler = async (id: number) => {
    if (todo.id !== id) return
    try {
      setEditId(id)
      setEditText(todo.title)
    } catch (error) {
      console.error("Ошибка при редактировании задачи:", error)
    }
  }

  const saveEditHandler = async (id: number) => {
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
      await editFetchTodos(id, trimmedText)
      setTodo((prevTodos) =>
        prevTodos.map((item) =>
          item.id === id ? { ...item, title: trimmedText } : item
        )
      )
      setEditId(null)
      setEditText("")
      setEditError(null)
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error)
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText("")
    setEditError(null)
  }

  const checkTodoHandler = async () => {

    try {
      await checkFetchTodos(todo.id, !todo.isDone)
      setTodo((prevTodos)=>
        prevTodos.map((item) =>
          item.id === todo.id ? { ...item, isDone: !item.isDone } : item 
        )
      )
    } catch (error) {
      console.error("Ошибка при check задачи:", error)
    }
  }

  return (
    <>
      <div className={styles.todo}>
        <div
          className={`${styles.todoText} ${
            todo.isDone ? styles.completedTodo : ""
          }`}
        >
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={todo.isDone}
            onChange={checkTodoHandler}
          />

          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value)
                if (editError) setEditError(null)
              }}
              autoFocus
            />
          ) : (
            <span>{todo.title}</span>
          )}
        </div>

        {isEditing ? (
          <>
            <button
              className={styles.saveButton}
              onClick={() => saveEditHandler(todo.id)}
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
            onClick={() => editTodoHandler(todo.id)}
          >
            <img
              src={iconWriting}
              alt="Редактировать"
            />
          </button>
        )}

        {deleteTodoHandler && (
          <button
            className={styles.deleteButton}
            onClick={() => deleteTodoHandler(todo.id)}
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
