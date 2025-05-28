import { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../redux/store"
import { logout } from "../../redux/authSlice"
import TodoNavigationPage from "../TodoNavigationPage"

interface PrivateRouteProps {
  component: React.ComponentType
}

const PrivateRoute = ({ component: Component }: PrivateRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    if ((!accessToken || !refreshToken) && isAuthenticated) {
      dispatch(logout())
      navigate("/auth")
    }
  }, [dispatch, isAuthenticated, navigate])

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
