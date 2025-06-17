import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import TodoListPage from './pages/TodoListPage/TodoListPage'
import ProfilePage from './pages/UserProfile/ProfilePage'
import PrivateRoute from './pages/Auth/PrivateRoute'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import { useRestoreSession } from './utils/useRestoreSession'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import AdminUserListPage from './pages/Admin/AdminUserListPage'


function App() {
	useRestoreSession()

	const { isLoading } = useSelector((state: RootState) => state.auth)

	if (isLoading) {
		return <div>Загрузка приложения...</div>
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route
						index
						element={<TodoListPage />}
					/>
					<Route
						path='userProfile'
						element={<ProfilePage />}
					/>
					<Route
						path='admin/users'
						element={<AdminUserListPage />}
					/>
				</Route>
				<Route
					path='auth/login'
					element={<LoginPage />}
				/>
				<Route
					path='auth/register'
					element={<RegisterPage />}
				/>
				<Route
					path='*'
					element={
						<Navigate
							to='/'
							replace
						/>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
