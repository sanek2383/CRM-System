import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Modal, FormInstance } from 'antd'
import authApi from '../../api/apiToken'
import { UserRegistration } from '../../types/auth'
import illustration from '../../../public/illustration.jpg'
import styles from './Auth.module.css'
import { AxiosError } from 'axios'

interface HandleLetterChangeParams {
	e: React.ChangeEvent<HTMLInputElement>
	setFieldValue: FormInstance['setFieldsValue']
}

interface ErrorResponseData {
	code?: string
	message?: string
}

const RegisterPage = () => {
	const [form] = Form.useForm()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const navigate = useNavigate()

	function isAxiosError(error: unknown): error is AxiosError {
		return typeof error === 'object' && error !== null && 'response' in error
	}

	function errorMessage(error: unknown): string {
		if (isAxiosError(error)) {
			const axiosError = error as AxiosError
			const response = axiosError.response

			if (response) {
				const { status, data } = response

				if (typeof data === 'string') {
					const lower = data.toLowerCase()
					if (lower.includes('token missing')) {
						return 'Сессия истекла. Авторизуйтесь заново.'
					}
					return data.trim()
				}

				if (data && typeof data === 'object') {
					const { code, message } = data as ErrorResponseData

					switch (status) {
						case 400:
							return 'Неверные данные. Пожалуйста, проверьте форму.'
						case 401:
							if (code === 'auth/token-missing') {
								return 'Сессия истекла. Авторизуйтесь заново.'
							}
							return 'Вы не авторизованы. Попробуйте войти снова.'
						case 403:
							return 'Доступ запрещён.'
						case 409:
							return 'Пользователь с такими данными уже существует'
						case 500:
							return 'Ошибка сервера. Попробуйте позже.'
						default:
							return `Ошибка регистрации ${status ?? ''}: ${
								message ?? 'Что-то пошло не так'
							}`
					}
				}

				return `Ошибка ${status ?? ''}: Что-то пошло не так`
			}
		}

		if (error instanceof Error) {
			return error.message
		}

		return 'Произошла неизвестная ошибка. Попробуйте позже.'
	}

	const handleLetterChange = ({
		e,
		setFieldValue,
	}: HandleLetterChangeParams) => {
		const { name, value } = e.target
		const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '')
		setFieldValue({ [name]: onlyLetters })
	}

	const handleLatinChange = ({
		e,
		setFieldValue,
	}: HandleLetterChangeParams) => {
		const { name, value } = e.target
		const onlyLetters = value.replace(/[^a-zA-Z]/g, '')
		setFieldValue({ [name]: onlyLetters })
	}

	const onFinish = async (values: UserRegistration) => {
		try {
			await authApi.post('/auth/signup', {
				login: values.login,
				username: values.username,
				password: values.password,
				email: values.email,
				phoneNumber: values.phoneNumber,
			})

			form.resetFields()
			setIsModalVisible(true)
		} catch (error) {
			alert(errorMessage(error))
		}
	}

	const handleOk = () => {
		setIsModalVisible(false)
		navigate('/auth/login')
	}

	return (
		<div className={styles.authorizationContainer}>
			<div className={styles.imageAuthorization}>
				<img
					src={illustration}
					alt='illustration'
				/>
			</div>
			<div className={styles.formAuthorization}>
				<div className={styles.formAuthorizationTitle}>
					<h1>Registration</h1>
				</div>

				<Form
					form={form}
					name='register'
					onFinish={onFinish}
					style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
					layout='horizontal'
				>
					<Form.Item
						name='username'
						label='Yours Name'
						rules={[
							{
								required: true,
								message: 'Please input your name!',
								whitespace: true,
							},
							{ min: 1, message: 'Текст должен содержать больше 1 символа.' },
							{ max: 60, message: 'Текст должен быть короче 60 символов.' },
							{
								pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
								message: 'Только буквы (латинские или кириллические)',
							},
						]}
					>
						<Input
							onChange={e =>
								handleLetterChange({ e, setFieldValue: form.setFieldsValue })
							}
						/>
					</Form.Item>

					<Form.Item
						name='email'
						label='E-mail'
						rules={[
							{ type: 'email', message: 'The input is not valid E-mail!' },
							{ required: true, message: 'Please input your E-mail!' },
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='login'
						label='Login'
						rules={[
							{
								required: true,
								message: 'Please input your nickname!',
								whitespace: true,
							},
							{
								min: 2,
								message: 'Login должен содержать больше 2-х символов.',
							},
							{ max: 60, message: 'Login должен быть короче 60 символов.' },
							{ pattern: /^[a-zA-Z]+$/, message: 'Только латинские буквы' },
						]}
					>
						<Input
							onChange={e =>
								handleLatinChange({ e, setFieldValue: form.setFieldsValue })
							}
						/>
					</Form.Item>

					<Form.Item
						name='password'
						label='Password'
						rules={[
							{ required: true, message: 'Please input your password!' },
							{
								min: 6,
								message: 'Пароль должен содержать больше 6 символов.',
							},
							{ max: 60, message: 'Пароль должен быть короче 60 символов.' },
						]}
						hasFeedback
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name='confirm'
						label='Confirm Password'
						dependencies={['password']}
						hasFeedback
						rules={[
							{ required: true, message: 'Please confirm your password!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve()
									}
									return Promise.reject(new Error('Passwords do not match!'))
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name='phoneNumber'
						label='Phone Number'
						rules={[
							{ message: 'Please input your phone number!' },
							{
								pattern: /^\+\d{7,}$/,
								message:
									'Телефон должен начинаться с + и содержать не менее 7 цифр',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='agreement'
						valuePropName='checked'
						rules={[
							{
								validator: (_, value) =>
									value
										? Promise.resolve()
										: Promise.reject(new Error('Should accept agreement')),
							},
						]}
						wrapperCol={{
							xs: { span: 24, offset: 0 },
							sm: { span: 16, offset: 8 },
						}}
					>
						<Checkbox>
							I have read the <a href=''>agreement</a>
						</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							xs: { span: 24, offset: 0 },
							sm: { span: 16, offset: 8 },
						}}
					>
						<Button
							type='primary'
							htmlType='submit'
						>
							Register
						</Button>
					</Form.Item>
				</Form>

				<div style={{ textAlign: 'center', marginTop: 16 }}>
					Already have an account?{' '}
					<Link
						to='/login'
						style={{ color: '#1890ff', textDecoration: 'underline' }}
					>
						Login
					</Link>
				</div>
			</div>

			<Modal
				title='Success'
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleOk}
				footer={[
					<Button
						key='ok'
						type='primary'
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

export default RegisterPage
