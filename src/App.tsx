import { useState } from "react"
import FormTodo from "./components/FormTodo"
import ListTodo from "./components/ListTodo"
import FilterTodo from "./components/FilterTodo"
import { TodoItem } from "./assets/models/todo"
import "./App.css"

function App() {
  const [todo, setTodo] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "work" | "done">("all")
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)

  const addTodoHandler = (text: string) => {
    const newTodo: TodoItem = {
      id: new Date().toISOString(),
      text,
      isCompleted: false,
    }
    setTodo([...todo, newTodo])
  }

  const deleteTodoHandler = (id: string) => {
    setTodo(todo.filter((item) => item.id !== id))
  }

  const editTodoHandler = (id: string) => {
    const task = todo.find((item) => item.id === id)
    if (task) {
      setEditId(id)
      setEditText(task.text)
    }
  }

  const saveEditHandler = (id: string) => {
    const trimmedText = editText.trim()

    if (trimmedText.length <= 2) {
      setEditError("Текст должен содержать больше 2 символов.")
      return
    }

    if (trimmedText.length > 64) {
      setEditError("Текст должен быть короче 64 символов.")
      return
    }

    setTodo(
      todo.map((item) =>
        item.id === id ? { ...item, text: trimmedText } : item
      )
    )
    setEditId(null)
    setEditText("")
    setEditError(null)
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText("")
    setEditError(null)
  }

  const checkTodoHandler = (id: string) => {
    setTodo(
      todo.map((item) =>
        item.id === id
          ? { ...item, isCompleted: !item.isCompleted }
          : { ...item }
      )
    )
  }

  const workCount = todo.filter((item) => !item.isCompleted).length
  const doneCount = todo.filter((item) => item.isCompleted).length

  const filteredTodo = todo.filter((item) => {
    if (filter === "work") return !item.isCompleted
    if (filter === "done") return item.isCompleted
    return true
  })

  return (
    <>
      <FormTodo addTodo={addTodoHandler} />
      <FilterTodo
        setFilter={setFilter}
        filter={filter}
        allCount={todo.length}
        workCount={workCount}
        doneCount={doneCount}
      />
      <ListTodo
        todo={filteredTodo}
        deleteTodo={deleteTodoHandler}
        checkTodo={checkTodoHandler}
        editId={editId}
        editText={editText}
        setEditText={setEditText}
        editTodo={editTodoHandler}
        saveEdit={saveEditHandler}
        cancelEdit={cancelEdit}
        editError={editError}
        setEditError={setEditError}
      />
    </>
  )
}

export default App
