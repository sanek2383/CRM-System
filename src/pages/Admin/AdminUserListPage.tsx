import { useCallback, useEffect, useState } from 'react'
import { Table, Input, Button, Tag, Space, Popconfirm, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	LockOutlined,
	UnlockOutlined,
} from '@ant-design/icons'
import adminApi from '../../api/apiToken'
import { User } from '../../types/admin'
import { useNavigate } from 'react-router-dom'

const AdminUserListPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)

	const navigate = useNavigate()
	const pageSize = 10

	const fetchUsers = useCallback(async () => {
		setLoading(true)
		try {
			const res = await adminApi.get('/admin/users', {
				params: {
					search,
					offset: (page - 1) * pageSize,
					limit: pageSize,
				},
			})
			setUsers(res.data.data)
			setTotal(res.data.meta.totalAmount)
		} catch (error) {
			message.error(`Ошибка загрузки пользователей: ${error}`)
		} finally {
			setLoading(false)
		}
	}, [page, search])

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers])

	const handleBlockToggle = async (user: User) => {
		try {
			const url = `/admin/users/${user.id}/${
				user.isBlocked ? 'unblock' : 'block'
			}`
			await adminApi.post(url)
			message.success(
				`Пользователь ${user.isBlocked ? 'разблокирован' : 'заблокирован'}`
			)
			fetchUsers()
		} catch {
			message.error('Ошибка при изменении статуса пользователя')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await adminApi.delete(`/admin/users/${id}`)
			message.success('Пользователь удалён')
			fetchUsers()
		} catch {
			message.error('Ошибка при удалении пользователя')
		}
	}

	const columns: ColumnsType<User> = [
		{
			title: 'Имя',
			dataIndex: 'username',
			sorter: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Телефон',
			dataIndex: 'phoneNumber',
		},
		{
			title: 'Дата регистрации',
			dataIndex: 'date',
			render: (dateString: string) => {
				if (!dateString) return '-'
				const date = new Date(dateString)
				return date.toLocaleString('ru-RU', {
					day: '2-digit',
					month: 'long',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
			},
		},
		{
			title: 'Статус',
			dataIndex: 'isBlocked',
			render: blocked =>
				blocked ? (
					<Tag color='red'>Заблокирован</Tag>
				) : (
					<Tag color='green'>Активен</Tag>
				),
		},
		{
			title: 'Роли',
			dataIndex: 'roles',
			render: roles =>
				roles.map((role: string) => <Tag key={role}>{role}</Tag>),
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_, user) => (
				<Space>
					<Button
						icon={<EyeOutlined />}
						onClick={() => navigate(`/admin/users/${user.id}`)}
					/>
					<Button
						icon={<EditOutlined />}
						onClick={() => navigate(`/admin/users/${user.id}/edit`)}
					/>
					<Button
						icon={user.isBlocked ? <LockOutlined /> : <UnlockOutlined />}
						onClick={() => handleBlockToggle(user)}
					/>
					<Popconfirm
						title='Удалить пользователя?'
						onConfirm={() => handleDelete(user.id)}
						okText='Да'
						cancelText='Нет'
					>
						<Button
							danger
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</Space>
			),
		},
	]

	return (
		<div style={{ padding: 24 }}>
			<h1>Пользователи</h1>
			<Input.Search
				placeholder='Поиск по email или имени'
				value={search}
				onChange={e => setSearch(e.target.value)}
				onSearch={() => setPage(1)}
				style={{ marginBottom: 16, maxWidth: 400 }}
			/>
			<Table
				columns={columns}
				dataSource={users}
				rowKey='id'
				loading={loading}
				pagination={{
					total,
					pageSize,
					current: page,
					onChange: p => setPage(p),
				}}
			/>
		</div>
	)
}

export default AdminUserListPage
