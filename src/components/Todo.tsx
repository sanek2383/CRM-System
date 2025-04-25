import { useState } from "react"
import { Checkbox, Button, Form, Input } from "antd"
import { TodoItem } from "../types/todo"
import {
  deleteFetchTodos,
  changeTodoStatus,
  editFetchTodos,
} from "../api/apiTodo"
import styles from "./Todo.module.css"
import iconWriting from "../../public/icon-writing-1.png"
import iconRecycleBin from "../../public/icon-recycle-bin.png"

interface TodoProps {
  todo: TodoItem
  reloadTodos: () => void
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Todo: React.FC<TodoProps> = ({ todo, reloadTodos }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editText, setEditText] = useState<string>("")
  const [editError, setEditError] = useState<string | null>(null)
  const [form] = Form.useForm()

  const deleteTodoHandler = async (id: number) => {
    try {
      await deleteFetchTodos(id)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при удалении задачи:" + error)
    }
  }

  const editTodoHandler = async (id: number) => {
    if (todo.id !== id) return
    try {
      setIsEdit(true)
      setEditText(todo.title)
      form.setFieldsValue({ noteEdit: todo.title })
    } catch (error) {
      alert("Ошибка при редактировании задачи:" + error)
    }
  }

  const saveEditHandler = async (value: { noteEdit: string }) => {
    const trimmedText = value.noteEdit.trim()

    if (trimmedText.length <= 2) {
      setEditError("Текст должен содержать больше 2 символов.")
      return
    }

    if (trimmedText.length > 64) {
      setEditError("Текст должен быть короче 64 символов.")
      return
    }
    try {
      await editFetchTodos(todo.id, trimmedText)

      setIsEdit(false)
      setEditError(null)

      reloadTodos()
    } catch (error) {
      alert("Ошибка при сохранении задачи:" + error)
    }
  }

  const cancelEditHandler = () => {
    setIsEdit(false)
    reloadTodos()
    setEditError(null)
  }

  const checkTodoHandler = async () => {
    try {
      await changeTodoStatus(todo.id, !todo.isDone)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при check задачи:" + error)
    }
  }

  return (
    <>
      <div className={styles.todo}>
        <div className={styles.todoText}>
          <Checkbox
            onChange={checkTodoHandler}
            className={styles.checkbox}
            checked={todo.isDone}
          ></Checkbox>

          {isEdit ? (
            <Form
              {...layout}
              form={form}
              name="editForm"
              onFinish={saveEditHandler}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="noteEdit"
                rules={[
                  { required: true, message: "Введите задачу" },
                  { min: 3, message: "Текст должен содержать больше 2 символов." },
                  { max: 64, message: "Текст должен быть короче 64 символов." },
                ]}
              >
                <Input
                  variant="underlined"
                  placeholder="Task To Be Done..."
                  value={editText}
                  onChange={() => {
                    if (editError) setEditError(null)
                  }}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  className={styles.saveButton}
                  type="primary"
                  htmlType="submit"
                >
                  Сохранить
                </Button>
                <Button
                  onClick={cancelEditHandler}
                  className={styles.cancelButton}
                  type="primary"
                >
                  Отмена
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <span className={todo.isDone ? styles.completedTodo : ""}>
              {todo.title}
            </span>
          )}
        </div>

        {!isEdit && (
          <Button
            onClick={() => editTodoHandler(todo.id)}
            className={styles.writingButton}
            type="primary"
          >
            <img
              src={iconWriting}
              alt="Редактировать"
            />
          </Button>
        )}
        <Button
          onClick={() => deleteTodoHandler(todo.id)}
          className={styles.deleteButton}
          type="primary"
        >
          <img
            src={iconRecycleBin}
            alt="Удалить"
          />
        </Button>
      </div>
      {isEdit && editError && (
        <p style={{ color: "red", margin: "5px 0 0 0" }}>{editError}</p>
      )}
    </>
  )
}

export default Todo
