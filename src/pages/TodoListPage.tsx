import { useState, useEffect } from "react"
import FormTodo from "../components/FormTodo.tsx"
import ListTodo from "../components/ListTodo.tsx"
import FilterTodo from "../components/FilterTodo.tsx"
import { TodoItem } from "../types/todo.ts"
import { allFetchTodos, createFetchTodos } from "../api/apiTodo.ts"

function MainTodoComponent() {
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
  }, [])

  const addTodoHandler = async (title: string) => {
    try {
      const newTodo = await createFetchTodos(title)

      setTodo([...todo, newTodo])
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error)
    }
  }

  const filteredTodos = todo.filter((item) => {
    if (filter === "work") return !item.isDone;
    if (filter === "done") return item.isDone;
    return true;
  })

  return (
    <>
      <FormTodo addTodo={addTodoHandler} />
      <FilterTodo
        todo={todo}
        setFilter={setFilter}
        filter={filter}
        // allCount={todo.length}
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
