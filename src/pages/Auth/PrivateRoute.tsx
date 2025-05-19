import { Navigate } from "react-router-dom"
import { useAuth } from "../../utils/useAuth"
import { JSX } from "react"

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/auth"
      replace
    />
  )
}

export default PrivateRoute
