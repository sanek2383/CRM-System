import Todo from "./Todo"
import { TodoItem } from "../types/todo"

interface ListTodoProps{
  todo: TodoItem[]
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>
  setEditId: React.Dispatch<React.SetStateAction<number | null>>
  editId: number | null
  editText: string
  setEditText: (text: string) => void
  editError: string | null
  setEditError: React.Dispatch<React.SetStateAction<string | null>>
}

const ListTodo: React.FC<ListTodoProps> = ({
  todo,
  setTodo,
  setEditId,
  editId,
  editText,
  setEditText,
  editError,
  setEditError,
}) => {
  return (
    <div>
      {!todo.length && <h2>Todo list is empty</h2>}
      {todo.map((item) => (
        <Todo
          key={item.id}
          todo={item}
          setTodo={setTodo}
          setEditId={setEditId}
          editId={editId}
          editText={editText}
          setEditText={setEditText}
          editError={editError}
          setEditError={setEditError}
        />
      ))}
    </div>
  )
}

export default ListTodo
