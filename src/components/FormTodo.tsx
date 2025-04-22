import { useState, useRef } from "react"
import { createFetchTodos } from "../api/apiTodo.ts"
import { TodoItem } from "../types/todo"
import styles from "./FormTodo.module.css"

interface FormTodoProps {
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>
  reloadTodos: () => void
}

const FormTodo: React.FC<FormTodoProps> = ({setTodo, reloadTodos}) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const enteredText = title.trim()

    if (enteredText.length <= 2) {
      setError("Текст должен содержать больше 2 символов.")
      inputRef.current?.focus()
      return
    }
    if (enteredText.length > 64) {
      setError("Текст должен быть короче 64 символов.")
      inputRef.current?.focus()
      return
    }
    addTodoHandler(enteredText)
    setTitle("")
    setError(null)
  }

  const addTodoHandler = async (title: string) => {
    try {
      const newTodo = await createFetchTodos(title)

      setTodo((prevTodos) => [...prevTodos, newTodo])
      reloadTodos()
    } catch (error) {
      alert("Ошибка при добавлении задачи:" + error)
    }
  }

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <input
          className={styles.input}
          placeholder="Task To Be Done..."
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null)
          }}
          ref={inputRef}
        />
        <button type="submit">Add</button>
      </form>
      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </>
  )
}

export default FormTodo
