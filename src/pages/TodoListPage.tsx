import { useState, useEffect, useCallback } from "react"
import FormTodo from "../components/FormTodo.tsx"
import ListTodo from "../components/ListTodo.tsx"
import FilterTodo from "../components/FilterTodo.tsx"
import { TodoItem, Todo } from "../types/todo.ts"
import { allFetchTodos } from "../api/apiTodo.ts"

function TodoListPage() {
  const [todos, setTodo] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "inWork" | "completed">("all")
  const [todoStats, setTodoStats] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const loadTodos = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await allFetchTodos(filter)
      if (response.info) {
        setTodo(
          response.data.map((item: Todo) => ({
            id: item.id,
            title: item.title,
            isDone: item.isDone,
          }))
        )
        setTodoStats(response.info)
      }
    } catch (error) {
      alert("Ошибка:" + error)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return (
    <>
      <FormTodo
        setTodo={setTodo}
        reloadTodos={loadTodos}
      />
      <FilterTodo
        todoStats={todoStats}
        setFilter={setFilter}
        filter={filter}
      />
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <ListTodo
          todo={todos}
          setTodo={setTodo}
          reloadTodos={loadTodos}
        />
      )}
    </>
  )
}

export default TodoListPage
