import Todo from "./Todo"
import { ListTodoProps } from "../assets/models/todo"

const ListTodo: React.FC<ListTodoProps> = ({ todo, deleteTodo, checkTodo }) => {
  return (
    <div>
      {!todo.length && <h2>Todo list is empty</h2>}
      {todo.map((item) => (
        <Todo
          key={item.id}
          todo={item}
          onDelete={() => deleteTodo && deleteTodo(item.id)}
          checkTodo={checkTodo}
        />
      ))}
    </div>
  )
}

export default ListTodo
