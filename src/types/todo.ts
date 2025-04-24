export interface TodoItem {
  id: number
  title: string
  isDone: boolean
}

export interface Todo {
  id: number
  title: string
  isDone: boolean
  created: string
}
export interface TodoFilterItem {
  all: number
  inWork: number
  completed: number
}

export interface MetaResponse<T, N> {
  data: T[]
  info?: N
  meta: {
    totalAmount: number
  }
}

export type FilterTodoChoice = "all" | "inWork" | "completed"
