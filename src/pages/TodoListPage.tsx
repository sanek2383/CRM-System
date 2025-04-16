import { useState, useEffect } from "react"
import FormTodo from "../components/FormTodo.tsx"
import ListTodo from "../components/ListTodo.tsx"
import FilterTodo from "../components/FilterTodo.tsx"
import { TodoItem } from "../types/todo.ts"
import { allFetchTodos, createFetchTodos } from "../api/apiTodo.ts"

function MainTodoComponent() {
  const [todo, setTodo] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "work" | "done">("all")
  const [todoStats, setTodoStats] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)

  const loadTodos = async () => {
    try {
      const response = await allFetchTodos(filter)
      setTodo(response.data)
      setTodoStats(response.info)
    } catch (error) {
      console.error("Ошибка:", error)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const filteredTodos = todo.filter((item) => {
    if (filter === "work") return !item.isDone
    if (filter === "done") return item.isDone
    return true
  })

  useEffect(() => {
    const allCount = todo.length
    const completedCount = todo.filter((item) => item.isDone).length
    const inWorkCount = allCount - completedCount

    setTodoStats({
      all: allCount,
      completed: completedCount,
      inWork: inWorkCount,
    })
  }, [todo])

  const addTodoHandler = async (title: string) => {
    try {
      const newTodo = await createFetchTodos(title)

      setTodo((prevTodos) => [...prevTodos, newTodo])
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error)
    }
  }

  return (
    <>
      <FormTodo addTodo={addTodoHandler} />
      <FilterTodo
        todoStats={todoStats}
        setFilter={setFilter}
        filter={filter}
      />
      <ListTodo
        todo={filteredTodos}
        setTodo={setTodo}
        setEditId={setEditId}
        editId={editId}
        editText={editText}
        setEditText={setEditText}
        editError={editError}
        setEditError={setEditError}
      />
    </>
  )
}

export default MainTodoComponent
