export interface TodoItem {
  id: string
  text: string
}

export interface TodoProps {
  todo: TodoItem
  onDelete?: () => void
}

export interface ListTodoProps {
  todo: TodoItem[]
  deleteTodo?: (id: string) => void
}

export interface FormTodoProps {
  addTodo: (text: string) => void
}
