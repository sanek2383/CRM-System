import { useState, useRef } from "react"
import { FormTodoProps } from "../assets/models/todo"
// import styles from './FormTodo.css'

const FormTodo: React.FC<FormTodoProps> = ({ addTodo }) => {
  const [text, setText] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const enteredText = text.trim()

    if (enteredText.length <= 2) {
      console.error("Text should be longer than 2 characters")
      inputRef.current?.focus()
      return
    }
    if (enteredText.length > 64) {
      console.error("The text must be shorter than 64 characters.")
      inputRef.current?.focus()
      return
    }
    addTodo(enteredText)
    setText("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        placeholder="Task To Be Done"
        required
        minLength={3}
        maxLength={64}
        value={text}
        onChange={(e) => setText(e.target.value)}
        ref={inputRef}
      />
      <button type="submit">Add</button>
    </form>
  )
}

export default FormTodo
