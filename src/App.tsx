import { useState, useEffect } from "react"
import FormTodo from "./components/FormTodo"
import ListTodo from "./components/ListTodo"
import FilterTodo from "./components/FilterTodo"
import { TodoItem } from "./types/todo"
import {
  allFetchTodos,
  createFetchTodos,
  deleteFetchTodos,
  checkFetchTodos,
} from "./api/apiTodo.ts"
import "./App.css"

function App() {
  const [todo, setTodo] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "work" | "done">("all")
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTodos() {
      try {
        const data = await allFetchTodos()
        setTodo(data)
      } catch (error) {
        console.error("Ошибка:", error)
      }
    }
    loadTodos()
  }, [todo])

  const addTodoHandler = async (title: string) => {
    try {
      const newTodo = await createFetchTodos(title)

      setTodo([...todo, newTodo])
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error)
    }
  }

  const deleteTodoHandler = async (id: number) => {
    try {
      await deleteFetchTodos(id)
      setTodo(todo.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error)
    }
  }

  const editTodoHandler = (id: number) => {
    const task = todo.find((item) => item.id === id)
    if (task) {
      setEditId(id)
      setEditText(task.title)
    }
  }

  const saveEditHandler = (id: number) => {
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
        item.id === id ? { ...item, title: trimmedText } : item
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

  const checkTodoHandler = async (id: number) => {
    const currentItem = todo.find((item) => item.id === id)
    if (!currentItem) return

    try {
      await checkFetchTodos(id, !currentItem.isDone)
      setTodo(
        todo.map((item) =>
          item.id === id ? { ...item, isDone: !item.isDone } : { ...item }
        )
      )
    } catch (error) {
      console.error("Ошибка при check задачи:", error)
    }
  }

  const workCount = todo.filter((item) => !item.isDone).length
  const doneCount = todo.filter((item) => item.isDone).length

  const filteredTodo = todo.filter((item) => {
    if (filter === "work") return !item.isDone
    if (filter === "done") return item.isDone
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
