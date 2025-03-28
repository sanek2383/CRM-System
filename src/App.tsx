import { useState } from "react"
import FormTodo from "./components/FormTodo"
import ListTodo from "./components/ListTodo"
// import Todo from "./components/Todo"
import { TodoItem } from "./assets/models/todo"
import "./App.css"

function App() {
  const [todo, setTodo] = useState<TodoItem[]>([])

  const addTodoHandler = (text: string) => {
    const newTodo: TodoItem = {
      id: new Date().toISOString(),
      text,
    }
    setTodo([...todo, newTodo])
  }

  const deleteTodoHandler = (id: string) => {
    setTodo(todo.filter((item => item.id !==id)))
  }

  return (
    <>
      {/* <Todo /> */}
      <FormTodo addTodo={addTodoHandler} />
      <ListTodo todo={todo} deleteTodo={deleteTodoHandler} />
    </>
  )
}

export default App
