import { Todo, TodoItem } from "../types/todo"

interface MetaResponse<T, N> {
  data: T[]
  info?: N
  meta: {
    totalAmount: number
  }
}

export const URL_BASE: string = "https://easydev.club/api/v1/todos"

export async function allFetchTodos(
  filter: "all" | "inWork" | "completed" = "all"
): Promise<
  MetaResponse<Todo, { all: number; completed: number; inWork: number }>
> {
  try {
    const response = await fetch(`${URL_BASE}?filter=${filter}`)

    if (!response.ok) {
      throw new Error(`Ошибка получения данных: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    alert("Ошибка получения данных: " + error)
    throw error
  }
}


export async function createFetchTodos(title: string): Promise<TodoItem> {
  try {
    const response = await fetch(URL_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        isDone: false,
      }),
    })
    if (!response.ok) {
      throw new Error(`Ошибка при создании: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    alert("Ошибка при создании: " + error)
    throw error
  }
}

export async function changeTodoStatus(id: number, isDone: boolean) {
  try {
    const response = await fetch(`${URL_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isDone }),
    })
    if (!response.ok) {
      throw new Error(`Ошибка при выборе: ${response.statusText}`)
    }
  } catch (error) {
    alert("Ошибка при выборе: " + error)
    throw error
  }
}

export async function deleteFetchTodos(id: number): Promise<void> {
  try {
    const response = await fetch(`${URL_BASE}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Ошибка при удалении: ${response.statusText}`)
    }
  } catch (error) {
    alert("Ошибка при удалении: " + error)
    throw error
  }
}

export async function editFetchTodos(id: number, title: string): Promise<Todo> {
  try {
    const response = await fetch(`${URL_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, isDone: false }),
    })
    if (!response.ok) {
      throw new Error(`Ошибка при исправлении: ${response.statusText}`)
    }
    return (await response.json()) as Todo
  } catch (error) {
    alert("Ошибка при исправлении: " + error)
    throw error
  }
}
