export interface TodoItem {
  id: number
  title: string
  isDone: boolean
}

export interface TodoProps {
  todo: TodoItem
  onDelete: () => void
  checkTodo: (id: number) => void
  editId: number | null
  editText: string
  setEditText: (text: string) => void
  editTodo: (id: number) => void
  saveEdit: (id: number) => void
  cancelEdit: () => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

export interface ListTodoProps {
  todo: TodoItem[]
  deleteTodo: (id: number) => void
  checkTodo: (id: number) => void
  editId: number | null
  editText: string
  setEditText: (text: string) => void
  editTodo: (id: number) => void
  saveEdit: (id: number) => void
  cancelEdit: () => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

export interface FormTodoProps {
  addTodo: (title: string) => void
}

export interface FilterTodoProps {
  setFilter: (filter: "all" | "work" | "done") => void
  filter: "all" | "work" | "done"
  allCount: number
  workCount: number
  doneCount: number
}

export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
  created: string; 
}

