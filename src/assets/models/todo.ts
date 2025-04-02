export interface TodoItem {
  id: string
  text: string
  isCompleted: boolean
}

export interface TodoProps {
  todo: TodoItem
  onDelete?: () => void
  checkTodo: (id: string) => void
}

export interface ListTodoProps {
  todo: TodoItem[]
  deleteTodo?: (id: string) => void
  checkTodo: (id: string) => void
}

export interface FormTodoProps {
  addTodo: (text: string) => void
}

export interface FilterTodoProps {
  setFilter: (filter:'all' | 'work' | 'done')=> void
  allCount: number;
  workCount: number;
  doneCount: number;
}
