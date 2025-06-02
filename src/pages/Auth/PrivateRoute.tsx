import { Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"

import TodoNavigationPage from "../TodoNavigationPage"
import { useEffect } from "react"
import { logout } from "../../redux/authSlice"

interface PrivateRouteProps {
  component: React.ComponentType
}

const PrivateRoute = ({ component: Component }: PrivateRouteProps) => {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

    useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    if (!accessToken && !refreshToken) {
      dispatch(logout())
    }
  }, [dispatch])

  if (isLoading) return <div>Загрузка...</div>

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
      />
    )
  }

  return (
    <>
      <TodoNavigationPage />
      <Component />
    </>
  )
}

export default PrivateRoute
