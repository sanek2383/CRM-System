import { useState, useRef } from "react"
import { FormTodoProps } from "../types/todo"
import styles from "./FormTodo.module.css"

const FormTodo: React.FC<FormTodoProps> = ({ addTodo }) => {
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
    addTodo(enteredText)
    setTitle("")
    setError(null)
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
