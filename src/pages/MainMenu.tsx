import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import {
	ContainerOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	PieChartOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Menu } from 'antd'
import styles from './TodoListPage/TodoListPage.module.css'
import { RootState } from '../redux/store'
import LogoutButton from '../components/LogoutButton/LogoutButton'
import { selectUser } from '../redux/sessionSlice'

type MenuItem = Required<MenuProps>['items'][number]

const MainMenu = () => {
	const { isAuthenticated, isLoading } = useSelector(
		(state: RootState) => state.auth
	)
	const [collapsed, setCollapsed] = useState(false)
	const [selectedKey, setSelectedKey] = useState('1')
	const location = useLocation()
	const user = useSelector(selectUser)

	const isAdminOrMod =
		user?.roles?.includes('ADMIN') || user?.roles?.includes('MODERATOR')

	const toggleCollapsed = () => {
		setCollapsed(!collapsed)
	}

	useEffect(() => {
		const currentPath = location.pathname

		let activeKey = '1'

		if (currentPath === '/') activeKey = '1'
		else if (currentPath === '/userProfile') activeKey = '2'
		else if (currentPath.startsWith('/admin/users')) activeKey = '3'

		setSelectedKey(activeKey)
	}, [location.pathname, user])

	if (isLoading) return <div>Загрузка...</div>

	if (!isAuthenticated) return null

	const items: MenuItem[] = [
		{
			key: '1',
			icon: <ContainerOutlined />,
			label: <NavLink to='/'>Список задач</NavLink>,
		},
		{
			key: '2',
			icon: <PieChartOutlined />,
			label: <NavLink to='/userProfile'>Профиль</NavLink>,
		},
		...(isAdminOrMod
			? [
					{
						key: '3',
						icon: <ContainerOutlined />,
						label: <NavLink to='/admin/users'>Пользователи</NavLink>,
					},
			  ]
			: []),
		{
			key: 'logout',
			label: <LogoutButton />,
			style: { marginTop: 'auto' },
		},
	]

	return (
		<>
			<aside
				className={styles.aside}
				style={{ zIndex: 999 }}
			>
				<Button
					type='primary'
					onClick={toggleCollapsed}
					className={styles.buttonMenuAside}
					style={{ marginBottom: 16 }}
				>
					{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				</Button>
				<Menu
					selectedKeys={[selectedKey]}
					mode='inline'
					theme='dark'
					inlineCollapsed={collapsed}
					items={items}
				/>
			</aside>
		</>
	)
}

export default MainMenu
