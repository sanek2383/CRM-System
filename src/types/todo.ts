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
  all: string
  inWork: string
  completed: string
}


