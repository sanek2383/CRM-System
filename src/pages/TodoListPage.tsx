import React, { useState, useEffect, useCallback } from "react"
import FormTodo from "../components/FormTodo.tsx"
import ListTodo from "../components/ListTodo.tsx"
import FilterTodo from "../components/FilterTodo.tsx"
import { TodoItem, Todo, FilterTodoChoice } from "../types/todo.ts"
import { allFetchTodos } from "../api/apiTodo.ts"

function TodoListPage() {
  const [todos, setTodo] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<FilterTodoChoice>("all")
  const [todoStats, setTodoStats] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
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
    const intervalLoad = setInterval(() => {
      if (!isEditing) {
        loadTodos()
      }
    }, 5000)
    return () => clearInterval(intervalLoad)
  }, [loadTodos, isEditing])

  return (
    <>
      <FormTodo reloadTodos={loadTodos} />
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
          reloadTodos={loadTodos}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  )
}

export default React.memo(TodoListPage)
