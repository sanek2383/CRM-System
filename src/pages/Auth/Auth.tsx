import { useDispatch } from "react-redux"
import { useState } from "react"
import { Button, Checkbox, Form, Input, Modal, FormInstance } from "antd"
import { useNavigate } from "react-router-dom"
import authApi from "../../api/apiToken"
import { login } from "../../redux/authSlice"
import { AuthData, UserRegistration } from "../../types/auth"
import { getReadableErrorMessage } from "../../utils/getReadableErrorMessage"
import illustration from "../../../public/illustration.jpg"
import styles from "./Auth.module.css"

interface HandleLetterChangeParams {
  e: React.ChangeEvent<HTMLInputElement>
  setFieldValue: FormInstance["setFieldsValue"]
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

const Auth = () => {
  const dispatch = useDispatch()
  const [isRegister, setIsRegister] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const onFinish = async (values: UserRegistration) => {
    try {
      const endpoint = isRegister ? "/auth/signup" : "/auth/signin"
      const apiData: AuthData | UserRegistration = isRegister
        ? {
            login: values.login,
            username: values.username,
            password: values.password,
            email: values.email,
            phoneNumber: values.phoneNumber,
          }
        : {
            login: values.login,
            password: values.password,
          }

      const response = await authApi.post(endpoint, apiData)

      if (!isRegister) {
        const { accessToken, refreshToken, user } = response.data

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)

        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
        } else {
          localStorage.removeItem("user")
        }

        dispatch(login({ token: accessToken, user }))
        navigate("/")
      } else {
        setIsRegister(false)
        form.resetFields()
        setIsModalVisible(true)
      }
    } catch (error) {
      const message = getReadableErrorMessage(error)
      alert(message)
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleLetterChange = ({
    e,
    setFieldValue,
  }: HandleLetterChangeParams) => {
    const { name, value } = e.target
    const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, "")
    setFieldValue({ [name]: onlyLetters })
  }

  const handleLatinChange = ({
    e,
    setFieldValue,
  }: HandleLetterChangeParams) => {
    const { name, value } = e.target
    const onlyLetters = value.replace(/[^a-zA-Z]/g, "")
    setFieldValue({ [name]: onlyLetters })
  }

  return (
    <div className={styles.authorizationContainer}>
      <div className={styles.imageAuthorization}>
        <img
          src={illustration}
          alt="illustration"
        />
      </div>
      <div className={styles.formAuthorization}>
        <div className={styles.formAuthorizationTitle}>
          {isRegister ? (
            <h1>Registration</h1>
          ) : (
            <>
              <h1>Login to your Account</h1>
              <p>See what is going on with your business</p>
            </>
          )}
        </div>

        <Form
          {...formItemLayout}
          form={form}
          name={isRegister ? "register" : "login"}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          className={styles.formAuth}
          scrollToFirstError
        >
          {isRegister && (
            <>
              <Form.Item
                name="username"
                label="Yours Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                    whitespace: true,
                  },
                  {
                    min: 1,
                    message: "Текст должен содержать больше 1 символа.",
                  },
                  { max: 60, message: "Текст должен быть короче 60 символов." },
                  {
                    pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
                    message:
                      "Логин может содержать только буквы (латинские или кириллические)",
                  },
                ]}
              >
                <Input
                  onChange={(e) =>
                    handleLetterChange({
                      e,
                      setFieldValue: form.setFieldsValue,
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { type: "email", message: "The input is not valid E-mail!" },
                  { required: true, message: "Please input your E-mail!" },
                ]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="login"
            label="Login"
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
              {
                min: 2,
                message: "Login должен содержать больше 2-х символов.",
              },
              { max: 60, message: "Login должен быть короче 60 символов." },
              {
                pattern: /^[a-zA-Z]+$/,
                message: "Логин может содержать только буквы (латинские буквы)",
              },
            ]}
          >
            <Input
              onChange={(e) =>
                handleLatinChange({
                  e,
                  setFieldValue: form.setFieldsValue,
                })
              }
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Пароль должен содержать больше 6 символов.",
              },
              { max: 60, message: "Пароль должен быть короче 60 символов." },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {isRegister && (
            <>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      )
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  {
                    message: "Please input your phone number!",
                  },
                  {
                    pattern: /^\+\d{7,}$/,
                    message: "Телефон должен начинаться с + и содержать не менее 7 цифр",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Should accept agreement")),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="">agreement</a>
                </Checkbox>
              </Form.Item>
            </>
          )}

          {!isRegister && (
            <Form.Item
              name="remember"
              valuePropName="checked"
              {...tailFormItemLayout}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          {isRegister ? "Already have an account?" : "Not Registered Yet?"}
          <a
            type="link"
            onClick={() => setIsRegister(!isRegister)}
            style={{ cursor: "pointer" }}
          >
            {isRegister ? " Login" : " Create an account"}
          </a>
        </div>
      </div>
      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
          >
            OK
          </Button>,
        ]}
      >
        <p>Registration successful! Please login.</p>
      </Modal>
    </div>
  )
}

export default Auth
