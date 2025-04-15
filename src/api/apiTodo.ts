import { Todo, TodoItem } from "../types/todo"

export const allData: string = "https://easydev.club/api/v1/todos"

export async function allFetchTodos(): Promise<Todo[]> {
  const response = await fetch(allData)

  if (!response.ok) {
    throw new Error(`Ошибка получения: ${response.status}`)
  }

  const result = await response.json()

  if (result.data && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

export async function createFetchTodos(title: string): Promise<TodoItem> {
  const response = await fetch(allData, {
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
}

export async function checkFetchTodos(id: number, isDone: boolean) {
  const response = await fetch(`${allData}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isDone }),
  })

  if (!response.ok) {
    throw new Error(`Ошибка при создании: ${response.statusText}`)
  }
}

export async function deleteFetchTodos(id: number): Promise<void> {
  const response = await fetch(`${allData}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Ошибка при удалении: ${response.statusText}`)
  }
}

export async function editFetchTodos(id: number, title: string): Promise<Todo> {
  const response = await fetch(`${allData}/${id}`, {
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
}

export async function filterFetchTodos(title: string): Promise<Todo> {
  const response = await fetch(allData, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error(`Ошибка фильтации: ${response.statusText}`)
  }
  return (await response.json()) as Todo
}
