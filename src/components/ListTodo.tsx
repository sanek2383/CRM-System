import Todo from "./Todo"
import { ListTodoProps } from "../assets/models/todo"

const ListTodo: React.FC<ListTodoProps> = ({ todo }) => {
  return todo.map((todo) => (
    <Todo
      key={todo.id}
      todo={todo}
    />
  ))
}

export default ListTodo
