import { Button, Form, Input, Space } from "antd"
import { useState } from "react"
import { createFetchTodos } from "../../api/apiTodo.ts"
import styles from "./FormTodo.module.css"

interface FormTodoProps {
  reloadTodos: () => void
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const FormTodo: React.FC<FormTodoProps> = ({ reloadTodos }) => {
  const [error, setError] = useState<string | null>(null)
  const [form] = Form.useForm()

  const onSubmitHandler = async (value: { note: string }) => {
    const enteredText = value.note.trim()

    try {
      await createFetchTodos(enteredText)
      form.resetFields()
      setError(null)
      reloadTodos()
    } catch (error) {
      alert("Ошибка при добавлении задачи:" + error)
    }
  }

  return (
    <>
      <Form
      className="form-todo"
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onSubmitHandler}
        style={{ maxWidth: 600, display: 'flex', marginBottom: 20, justifyContent:'center' }}
      >
        <Form.Item
          name="note"
          rules={[
            { required: true, message: "Введите задачу" },
            { min: 2, message: "Текст должен содержать больше 2 символов." },
            { max: 64, message: "Текст должен быть короче 64 символов." },
          ]}
        >
          <Input
            rootClassName={styles.inputTodo}
            variant="underlined"
            placeholder="Task To Be Done..."
            onChange={() => {
              if (error) setError(null)
            }}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
            >
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </>
  )
}

export default FormTodo
