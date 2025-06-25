import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const PrivateRoute = () => {
	const { isAuthenticated, isLoading } = useSelector(
		(state: RootState) => state.auth
	)

	if (isAuthenticated === null || isLoading) return <div>Загрузка...</div>

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate
			to='/auth/login'
			replace
		/>
	)
}

export default PrivateRoute
