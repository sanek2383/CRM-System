export interface TodoItem {
  id: string
  text: string
  isCompleted: boolean
}

export interface TodoProps {
  todo: TodoItem
  onDelete: () => void
  checkTodo: (id: string) => void
  editId: string | null
  editText: string
  setEditText: (text: string) => void
  editTodo: (id: string) => void
  saveEdit: (id: string) => void
  cancelEdit: () => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

export interface ListTodoProps {
  todo: TodoItem[]
  deleteTodo: (id: string) => void
  checkTodo: (id: string) => void
  editId: string | null
  editText: string
  setEditText: (text: string) => void
  editTodo: (id: string) => void
  saveEdit: (id: string) => void
  cancelEdit: () => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

export interface FormTodoProps {
  addTodo: (text: string) => void
}

export interface FilterTodoProps {
  setFilter: (filter: "all" | "work" | "done") => void
  filter: "all" | "work" | "done"
  allCount: number
  workCount: number
  doneCount: number
}
