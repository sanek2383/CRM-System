import { Navigate, Outlet } from 'react-router-dom'
import {  useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import MainMenu from '../MainMenu'




const PrivateRoute = () => {

  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  if (isAuthenticated === null || isLoading) return <div>Загрузка...</div>

  if (!isAuthenticated) {
    return (
			<Navigate
				to='auth/login'
				replace
			/>
		)
  }

  return (
		<>
			<MainMenu />
			<Outlet />
		</>
	)
}

export default PrivateRoute
