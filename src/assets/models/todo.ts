export interface TodoItem {
  id: number
  text: string
}

export interface TodoProps {
  todo: TodoItem
}

export interface ListTodoProps {
  todo: TodoItem[]
}

export interface FormTodoProps {
  addTodo: (text: string) => void
}
