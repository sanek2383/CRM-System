import Todo from "./Todo"
import { TodoItem } from "../types/todo"

interface ListTodoProps {
  todo: TodoItem[]
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>
  reloadTodos: () => void
}

const ListTodo: React.FC<ListTodoProps> = ({
  todo,
  setTodo,
  reloadTodos,
}) => {
  return (
    <div>
      {!todo.length && <h2>Todo list is empty</h2>}
      {todo.map((item) => (
        <Todo
          key={item.id}
          todo={item}
          setTodo={setTodo}
          reloadTodos={reloadTodos}
        />
      ))}
    </div>
  )
}

export default ListTodo
