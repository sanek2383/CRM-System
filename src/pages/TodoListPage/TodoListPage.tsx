import React, { useEffect, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormTodo from "../../components/FormTodo/FormTodo.tsx"
import ListTodo from "../../components/ListTodo/ListTodo.tsx"
import FilterTodo from "../../components/FilterTodo/FilterTodo.tsx"
import { Todo } from "../../types/todo.ts"
import { allFetchTodos } from "../../api/apiTodo.ts"
import { setTodos, setFilter, updateStats } from "../../redux/todoSlice"
import { RootState } from "../../redux/store.ts"
import styles from './TodoListPage.module.css'

function TodoListPage() {
  const dispatch = useDispatch()
  const { todos, filter } = useSelector((state: RootState) => state.todo)
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
        dispatch(setTodos(response.data.map((item: Todo) => ({
          id: item.id,
          title: item.title,
          isDone: item.isDone,
        }))))
        dispatch(updateStats(response.info))
        setTodoStats(response.info)
      }
    } catch (error) {
      alert("Ошибка:" + error)
    } finally {
      setIsLoading(false)
    }
  }, [filter, dispatch])

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
    <div className={styles.todoBlock}>
      <FormTodo reloadTodos={loadTodos} />
      <FilterTodo
        todoStats={todoStats}
        setFilter={(newFilter) => dispatch(setFilter(newFilter))}
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
    </div>
  )
}

export default React.memo(TodoListPage)
