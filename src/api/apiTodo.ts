import axios from "axios"
import {
  Todo,
  TodoItem,
  TodoFilterItem,
  FilterTodoChoice,
  MetaResponse,
} from "../types/todo"

// export const URL_BASE: string = "https://easydev.club/api/v1/todos"

const apiTodoList = axios.create({
  baseURL: "https://easydev.club/api/v1/todos",
  headers: {
    "Content-Type": "application/json",
  },
})

export async function allFetchTodos(
  filter: FilterTodoChoice = "all"
): Promise<MetaResponse<Todo, TodoFilterItem>> {
  try {
    const response = await apiTodoList.get<MetaResponse<Todo, TodoFilterItem>>(
      "",
      {
        params: { filter },
      }
    )

    return response.data
  } catch (error) {
    alert("Ошибка получения данных: " + error)
    throw error
  }
}

export async function createFetchTodos(title: string): Promise<TodoItem> {
  try {
    const response = await apiTodoList.post<TodoItem>("", {
      title: title,
      isDone: false,
    })
    return response.data
  } catch (error) {
    alert("Ошибка при создании: " + error)
    throw error
  }
}

export async function changeTodoStatus(
  id: number,
  isDone: boolean
): Promise<void> {
  try {
    await apiTodoList.put(`/${id}`, { isDone })
  } catch (error) {
    alert("Ошибка при выборе: " + error)
    throw error
  }
}

export async function deleteFetchTodos(id: number): Promise<void> {
  try {
    await apiTodoList.delete(`/${id}`, {})
  } catch (error) {
    alert("Ошибка при удалении: " + error)
    throw error
  }
}

export async function editFetchTodos(id: number, title: string): Promise<Todo> {
  try {
    const response = await apiTodoList.put(`/${id}`, {
      title,
      isDone: false,
    })

    return response.data
  } catch (error) {
    alert("Ошибка при исправлении: " + error)
    throw error
  }
}
