import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const PrivateRoute = () => {
	const { isAuthenticated, isLoading, user } = useSelector(
		(state: RootState) => state.auth
	)

	const location = useLocation()

	if (isAuthenticated === null || isLoading) return <div>Загрузка...</div>

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/auth/login'
				replace
			/>
		)
	}

	const adminPaths = ['/admin/users']

	const isAdminOrMod =
		user?.roles.includes('ADMIN') || user?.roles.includes('MODERATOR')

	if (
		adminPaths.some(path => location.pathname.startsWith(path)) &&
		!isAdminOrMod
	) {
		return (
			<Navigate
				to='/'
				replace
			/>
		)
	}
	return <Outlet />

	// return isAuthenticated ? (
	// 	<Outlet />
	// ) : (
	// 	<Navigate
	// 		to='/auth/login'
	// 		replace
	// 	/>
	// )
}

export default PrivateRoute
