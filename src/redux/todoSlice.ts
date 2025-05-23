import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TodoItem } from "../types/todo"

export interface TodoState {
  todos: TodoItem[]
  filter: "all" | "completed" | "inWork"
  stats: {
    all: number
    completed: number
    inWork: number
  }
}

const initialState: TodoState = {
  todos: [],
  filter: "all",
  stats: {
    all: 0,
    completed: 0,
    inWork: 0,
  },
}

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<TodoItem[]>) {
      state.todos = action.payload
    },
    setFilter(state, action: PayloadAction<"all" | "completed" | "inWork">) {
      state.filter = action.payload
    },
    updateStats(
      state,
      action: PayloadAction<{ all: number; completed: number; inWork: number }>
    ) {
      state.stats = action.payload
    },
  },
})

export const { setTodos, setFilter, updateStats } = todoSlice.actions
export default todoSlice.reducer