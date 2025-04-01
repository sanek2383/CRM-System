import { useState, useRef } from "react"
import { FormTodoProps } from "../assets/models/todo"
// import styles from './FormTodo.css'

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
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  )
}

export default FormTodo
