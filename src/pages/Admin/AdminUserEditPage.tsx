import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button, message, Tag } from 'antd'
import authApi from '../../api/authApi'
import { User, UserRequest, Roles } from '../../types/admin'

const AdminUserEditPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await authApi.get<User>(`/admin/users/${id}`)
				setUser(res.data)
				form.setFieldsValue(res.data)
			} catch (error) {
				message.error(
					`Ошибка при загрузке пользователя: ${
						error instanceof Error ? error.message : String(error)
					}`
				)
			}
		}
		fetchUser()
	}, [id, form])

	const handleSave = async (
		values: Partial<UserRequest & { phoneNumber?: string }>
	) => {
		setLoading(true)
		try {
			const changedFields: Partial<UserRequest & { phoneNumber?: string }> = {}

			if (values.username !== undefined && values.username !== user?.username) {
				changedFields.username = values.username
			}
			if (values.email !== undefined && values.email !== user?.email) {
				changedFields.email = values.email
			}
			if (
				values.phoneNumber !== undefined &&
				values.phoneNumber !== user?.phoneNumber
			) {
				changedFields.phoneNumber = values.phoneNumber
			}

			await authApi.put(`/admin/users/${id}`, changedFields)
			message.success('Пользователь обновлён')
			navigate('/admin/users')
		} catch (error) {
			if (error instanceof Error) {
				const msg =
					(error as { response?: { data?: unknown } })?.response?.data ||
					'Ошибка при сохранении'
				message.error(typeof msg === 'string' ? msg : 'Неизвестная ошибка')
			} else {
				message.error('Неизвестная ошибка')
			}
		} finally {
			setLoading(false)
		}
	}

	if (!user) return null

	return (
		<div style={{ padding: 24, maxWidth: 600 }}>
			<h1>Редактирование пользователя</h1>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleSave}
				initialValues={user}
			>
				<Form.Item
					name='username'
					label='Имя'
					rules={[
						{ required: true },
						{ min: 1, message: 'Текст должен содержать больше 1 символа.' },
						{ max: 60, message: 'Текст должен быть короче 60 символов.' },
						{
							pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
							message: 'Только буквы (латинские или кириллические)',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name='email'
					label='Email'
					rules={[{ required: true, type: 'email' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name='phoneNumber'
					label='Телефон'
					rules={[
						{
							pattern: /^\+\d{7,}$/,
							message:
								'Телефон должен начинаться с + и содержать не менее 7 цифр',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item label='Роли'>
					<div>
						{user.roles.map(role => (
							<Tag
								key={role}
								color={
									role === Roles.ADMIN
										? 'red'
										: role === Roles.MODERATOR
										? 'blue'
										: 'green'
								}
							>
								{role}
							</Tag>
						))}
					</div>
				</Form.Item>
				<Form.Item label='Статус блокировки'>
					<Tag color={user.isBlocked ? 'red' : 'green'}>
						{user.isBlocked ? 'Заблокирован' : 'Активен'}
					</Tag>
				</Form.Item>

				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						loading={loading}
					>
						Сохранить
					</Button>
					<Button
						style={{ marginLeft: 8 }}
						onClick={() => navigate(-1)}
					>
						Отмена
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default AdminUserEditPage
