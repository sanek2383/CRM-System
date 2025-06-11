import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Form, Input, Button, Checkbox } from 'antd'
import authApi, { setAccessToken } from '../../api/apiToken'
import { login } from '../../redux/sessionSlice'
import { AuthData } from '../../types/auth'
import illustration from '../../../public/illustration.jpg'
import styles from './Auth.module.css'

interface ErrorResponseData {
	code?: string
	message?: string
}


const tailFormItemLayout = {
	wrapperCol: {
		xs: { span: 24, offset: 0 },
		sm: { span: 16, offset: 8 },
	},
}

const LoginPage = () => {
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const navigate = useNavigate()

	function isAxiosError(error: unknown): error is AxiosError {
		return typeof error === 'object' && error !== null && 'response' in error
	}


	function getReadableErrorMessage(error: unknown): string {
		if (isAxiosError(error)) {
			const axiosError = error as AxiosError
			const response = axiosError.response

			if (response) {
				const { status, data } = response

				if (typeof data === 'string') {
					const lower = data.toLowerCase()
					if (lower.includes('invalid credentials')) {
						return 'Неверный логин или пароль'
					}
					if (lower.includes('token missing')) {
						return 'Сессия истекла. Авторизуйтесь заново.'
					}
					return data.trim()
				}

				if (data && typeof data === 'object') {
					const { code, message } = data as ErrorResponseData

					switch (status) {
						case 401:
							if (code === 'auth/invalid-credentials') {
								return 'Неверный логин или пароль'
							}
							if (code === 'auth/token-missing') {
								return 'Сессия истекла. Авторизуйтесь заново.'
							}
							return 'Вы не авторизованы. Попробуйте войти снова.'
						case 403:
							return 'Доступ запрещён.'
						case 500:
							return 'Ошибка сервера. Попробуйте позже.'
						default:
							return `Ошибка ${status ?? ''}: ${
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
	
	

	const onFinish = async (values: AuthData) => {
		try {
			const response = await authApi.post('/auth/signin', values)

			const { accessToken, refreshToken, user } = response.data

			localStorage.setItem('refreshToken', refreshToken)

			dispatch(login({ token: accessToken, refreshToken, user }))
			setAccessToken(accessToken)
			navigate('/')
		} catch (error) {
			console.error('Ошибка входа:', error)
			if (error instanceof AxiosError) {
				console.error('Axios error response:', error.response)
				console.error('Axios error response data:', error.response?.data)
			}
			alert(getReadableErrorMessage(error))
		}
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
					<h1>Login to your Account</h1>
					<p>See what is going on with your business</p>
				</div>

				<Form
					form={form}
					name='login'
					onFinish={onFinish}
					layout='horizontal'
					style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
				>
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
							{
								pattern: /^[a-zA-Z]+$/,
								message: 'Логин может содержать только буквы (латинские)',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='password'
						label='Password'
						rules={[
							{ required: true, message: 'Please input your password!' },
							{ min: 6, message: 'Пароль должен содержать больше 6 символов.' },
							{ max: 60, message: 'Пароль должен быть короче 60 символов.' },
						]}
						hasFeedback
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						{...tailFormItemLayout}
						name='remember'
						valuePropName='checked'
						style={{ marginTop: 50 }}
					>
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item {...tailFormItemLayout}>
						<Button
							type='primary'
							htmlType='submit'
							style={{ marginTop: 20 }}
						>
							Login
						</Button>
					</Form.Item>
				</Form>

				<div style={{ textAlign: 'center', marginTop: 16 }}>
					Not Registered Yet?{' '}
					<Link
						to='/auth/register'
						style={{ color: '#1890ff', textDecoration: 'underline' }}
					>
						Create an account
					</Link>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
