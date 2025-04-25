import axios from "axios"
import {
  Todo,
  TodoItem,
  TodoFilterItem,
  FilterTodoChoice,
  MetaResponse,
} from "../types/todo"

export const URL_BASE: string = "https://easydev.club/api/v1/todos"

export async function allFetchTodos(
  filter: FilterTodoChoice = "all"
): Promise<MetaResponse<Todo, TodoFilterItem>> {
  try {
    const response = await axios.get(`${URL_BASE}?filter=${filter}`)

    return response.data
  } catch (error) {
    alert("Ошибка получения данных: " + error)
    throw error
  }
}

export async function createFetchTodos(title: string): Promise<TodoItem> {
  try {
    const response = await axios.post(URL_BASE, {
      headers: {
        "Content-Type": "application/json",
      },
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
    await axios.put(
      `${URL_BASE}/${id}`,
      { isDone },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    alert("Ошибка при выборе: " + error)
    throw error
  }
}

export async function deleteFetchTodos(id: number): Promise<void> {
  try {
    await axios.delete(`${URL_BASE}/${id}`, {})
  } catch (error) {
    alert("Ошибка при удалении: " + error)
    throw error
  }
}

export async function editFetchTodos(id: number, title: string): Promise<Todo> {
  try {
    const response = await axios.put(`${URL_BASE}/${id}`, {
      title,
      isDone: false,
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    alert("Ошибка при исправлении: " + error)
    throw error
  }
}
