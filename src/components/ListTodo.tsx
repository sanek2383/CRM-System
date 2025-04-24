import Todo from "./Todo"
import { TodoItem } from "../types/todo"

interface ListTodoProps {
  todo: TodoItem[]
  reloadTodos: () => void
}

const ListTodo: React.FC<ListTodoProps> = ({
  todo,
  reloadTodos,
}) => {
  return (
    <div>
      {!todo.length && <h2>Todo list is empty</h2>}
      {todo.map((item) => (
        <Todo
          key={item.id}
          todo={item}
          reloadTodos={reloadTodos}
        />
      ))}
    </div>
  )
}

export default ListTodo
