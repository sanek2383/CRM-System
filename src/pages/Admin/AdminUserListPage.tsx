import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Table,
	Input,
	Button,
	Tag,
	Space,
	Popconfirm,
	message,
	Modal,
	Checkbox,
	Radio,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	EditOutlined,
	DeleteOutlined,
	LockOutlined,
	UnlockOutlined,
} from '@ant-design/icons'
import authApi from '../../api/authApi'
import { Roles, User } from '../../types/admin'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { RootState } from '../../redux/store'
import { setFilters } from '../../redux/adminUserTableSlice'

const AdminUserListPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [roleModalOpen, setRoleModalOpen] = useState(false)
	const [selectedRoles, setSelectedRoles] = useState<Roles[]>([])
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const { search, page, blockFilter, sortBy, sortOrder } = useSelector(
		(state: RootState) => state.adminUserTable
	)

	const navigate = useNavigate()

	const pageSize = 10

	const fetchUsers = useCallback(async () => {
		setLoading(true)
		try {
			const isBlocked =
				blockFilter === 'blocked'
					? true
					: blockFilter === 'active'
					? false
					: undefined

			const res = await authApi.get('/admin/users', {
				params: {
					search,
					offset: (page - 1) * pageSize,
					limit: pageSize,
					sortBy,
					sortOrder,
					isBlocked,
				},
			})

			setUsers(res.data.data)
			setTotal(res.data.meta.totalAmount)
		} catch (error) {
			message.error(`Ошибка загрузки пользователей: ${error}`)
		} finally {
			setLoading(false)
		}
	}, [page, search, sortBy, sortOrder, blockFilter])

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers])

	const handleBlockToggle = async (user: User) => {
		try {
			const url = `/admin/users/${user.id}/${
				user.isBlocked ? 'unblock' : 'block'
			}`
			await authApi.post(url)
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
			await authApi.delete(`/admin/users/${id}`)
			message.success('Пользователь удалён')
			fetchUsers()
		} catch {
			message.error('Ошибка при удалении пользователя')
		}
	}

	const openRoleModal = (user: User) => {
		setSelectedUser(user)
		setSelectedRoles(user.roles)
		setRoleModalOpen(true)
	}

	const handleUpdateRoles = async () => {
		if (!selectedUser) return

		if (selectedRoles.length === 0) {
			message.warning('У пользователя должна быть хотя бы одна роль')
			return
		}

		try {
			await authApi.post(`/admin/users/${selectedUser.id}/rights`, {
				roles: selectedRoles,
			})
			message.success('Роли обновлены')
			setRoleModalOpen(false)
			fetchUsers()
		} catch {
			message.error('Ошибка при обновлении ролей')
		}
	}

	useEffect(() => {
		const current = Object.fromEntries(searchParams.entries())
		const next = {
			search,
			page: String(page),
			blockFilter,
			sortBy: sortBy ?? '',
			sortOrder: sortOrder ?? '',
		}

		if (JSON.stringify(current) !== JSON.stringify(next)) {
			setSearchParams(next)
		}
	}, [
		search,
		page,
		blockFilter,
		sortBy,
		sortOrder,
		searchParams,
		setSearchParams,
	])
	

	const columns: ColumnsType<User> = [
		{
			title: 'Имя',
			dataIndex: 'username',
			sorter: true,
			sortOrder:
				sortBy === 'username'
					? sortOrder === 'asc'
						? 'ascend'
						: 'descend'
					: undefined,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			sorter: true,
			sortOrder:
				sortBy === 'email'
					? sortOrder === 'asc'
						? 'ascend'
						: 'descend'
					: undefined,
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
					<Button onClick={() => openRoleModal(user)}>Изменить роли</Button>
					<Button
						icon={<EditOutlined />}
						onClick={() =>
							navigate(`/admin/users/${user.id}/edit`, {
								state: {
									search,
									page,
									blockFilter,
									sortBy,
									sortOrder,
								},
							})
						}
					>
						Перейти к профилю
					</Button>

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
		<div style={{ padding: 24, width: '70%', marginInline: 'auto' }}>
			<h1>Пользователи</h1>
			<Input.Search
				placeholder='Поиск по email или имени'
				value={search}
				onChange={e => dispatch(setFilters({ search: e.target.value }))}
				onSearch={() => {
					dispatch(setFilters({ page: 1 }))
				}}
				style={{ marginBottom: 16, marginRight: 20, maxWidth: 400 }}
			/>
			<Radio.Group
				value={blockFilter}
				onChange={e => {
					dispatch(setFilters({ blockFilter: e.target.value, page: 1 }))
				}}
				style={{ marginBottom: 16 }}
			>
				<Radio.Button value='all'>Все</Radio.Button>
				<Radio.Button value='blocked'>Заблокированные</Radio.Button>
				<Radio.Button value='active'>Активные</Radio.Button>
			</Radio.Group>

			<Table
				columns={columns}
				dataSource={users}
				rowKey='id'
				loading={loading}
				pagination={{
					total,
					pageSize,
					current: page,
					onChange: p => dispatch(setFilters({ page: p })),
				}}
				onChange={(_pagination, _filters, sorter) => {
					if (!Array.isArray(sorter) && sorter.order) {
						dispatch(
							setFilters({
								sortBy: sorter.field as string,
								sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
							})
						)
					} else {
						dispatch(
							setFilters({
								sortBy: undefined,
								sortOrder: undefined,
							})
						)
					}
				}}
			/>
			<Modal
				title={`Изменение ролей: ${selectedUser?.username}`}
				open={roleModalOpen}
				onCancel={() => setRoleModalOpen(false)}
				onOk={handleUpdateRoles}
				okText='Сохранить'
				cancelText='Отмена'
			>
				<Checkbox.Group
					options={Object.values(Roles)}
					value={selectedRoles}
					onChange={checked => setSelectedRoles(checked as Roles[])}
				/>
			</Modal>
		</div>
	)
}

export default AdminUserListPage
