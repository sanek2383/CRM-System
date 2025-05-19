import Todo from "../Todo/Todo"
import { TodoItem } from "../../types/todo"

interface ListTodoProps {
  todo: TodoItem[]
  reloadTodos: () => void
  setIsEditing: (isEditing: boolean) => void
}

const ListTodo: React.FC<ListTodoProps> = ({
  todo,
  reloadTodos,
  setIsEditing,
}) => {
  return (
    <div>
      {!todo.length && <h2>Todo list is empty</h2>}
      {todo.map((item) => (
        <Todo
          key={item.id}
          todo={item}
          reloadTodos={reloadTodos}
          setIsEditing={setIsEditing}
        />
      ))}
    </div>
  )
}

export default ListTodo
