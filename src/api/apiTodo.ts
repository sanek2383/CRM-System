import { api } from "./axiosInstance"
import {
  Todo,
  TodoItem,
  TodoFilterItem,
  FilterTodoChoice,
  MetaResponse,
} from "../types/todo"


export async function allFetchTodos(
  filter: FilterTodoChoice = "all"
): Promise<MetaResponse<Todo, TodoFilterItem>> {
  try {
    const response = await api.get<MetaResponse<Todo, TodoFilterItem>>("", {
      params: { filter },
    })

    return response.data
  } catch (error) {
    alert("Ошибка получения данных: " + error)
    throw error
  }
}

export async function createFetchTodos(title: string): Promise<TodoItem> {
  try {
    const response = await api.post<TodoItem>("", {
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
    await api.put(`/${id}`, { isDone })
  } catch (error) {
    alert("Ошибка при выборе: " + error)
    throw error
  }
}

export async function deleteFetchTodos(id: number): Promise<void> {
  try {
    await api.delete(`/${id}`, {})
  } catch (error) {
    alert("Ошибка при удалении: " + error)
    throw error
  }
}

export async function editFetchTodos(id: number, title: string): Promise<Todo> {
  try {
    const response = await api.put(`/${id}`, {
      title,
      isDone: false,
    })

    return response.data
  } catch (error) {
    alert("Ошибка при исправлении: " + error)
    throw error
  }
}
