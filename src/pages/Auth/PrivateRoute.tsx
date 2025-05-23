import { Navigate } from "react-router-dom"
import {useSelector} from 'react-redux'
import { RootState } from "../../redux/store"
import TodoNavigationPage from "../TodoNavigationPage"


interface PrivateRouteProps {
  component: React.ComponentType
}

const PrivateRoute = ({ component: Component }: PrivateRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return isAuthenticated ? (
    <>
      <TodoNavigationPage />
      <Component />
    </>
  ) : (
    <Navigate to="/auth" replace />
  )
}

export default PrivateRoute