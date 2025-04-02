import { useState, useRef } from "react"
import { FormTodoProps } from "../assets/models/todo"
import styles from './FormTodo.module.css'

const FormTodo: React.FC<FormTodoProps> = ({ addTodo }) => {
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const enteredText = text.trim()

    if (enteredText.length <= 2) {
      setError("Text should be longer than 2 characters")
      inputRef.current?.focus()
      return
    }
    if (enteredText.length > 64) {
      setError("The text must be shorter than 64 characters.")
      inputRef.current?.focus()
      return
    }
    addTodo(enteredText)
    setText("")
    setError(null)
  }

  return (
    <>
    <form onSubmit={onSubmitHandler}>
      <input
      className={styles.input}
        placeholder="Task To Be Done"
        required
        value={text}
        onChange={(e) => {
          setText(e.target.value)
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
