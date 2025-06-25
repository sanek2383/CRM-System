import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import TodoListPage from './pages/TodoListPage/TodoListPage'
import ProfilePage from './pages/UserProfile/ProfilePage'
import PrivateRoute from './pages/Auth/PrivateRoute'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import { useRestoreSession } from './utils/useRestoreSession'
import AppLayout from './components/AppLayout/AppLayout'
import AuthPage from './pages/Auth/AuthPage'
import LoginForm from './components/LoginForm/LoginForm'
import RegisterForm from './components/RegisterForm/RegisterForm'
import AdminUserListPage from './pages/Admin/AdminUserListPage'
import AdminUserEditPage from './pages/Admin/AdminUserEditPage'


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
					<Route element={<AppLayout />}>
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
					<Route
						path='admin/users/:id/edit'
						element={<AdminUserEditPage />}
					/>
					</Route>
				</Route>

				<Route
					path='auth'
					element={<AuthPage />}
				>
					<Route
						path='login'
						element={<LoginForm />}
					/>
					<Route
						path='register'
						element={<RegisterForm />}
					/>
				</Route>
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
