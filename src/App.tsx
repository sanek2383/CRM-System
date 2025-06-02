import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import TodoListPage from "./pages/TodoListPage/TodoListPage"
import ProfilePage from "./pages/UserProfile/ProfilePage"
import Auth from "./pages/Auth/Auth"
import PrivateRoute from "./pages/Auth/PrivateRoute"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import authApi from "./api/apiToken"
import { RootState } from "./redux/store"
import {
  restoreAuthSuccess,
  logout,
  startRestore,
  finishRestore,
} from "./redux/authSlice"
import { Profile } from "./types/auth"

function App() {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: RootState) => state.auth)



useEffect(() => {
  const restoreSession = async () => {
    dispatch(startRestore())
    console.log("Восстановление сессии запускается")

    try {
      const res = await authApi.get<Profile>("/user/profile")

      dispatch(
        restoreAuthSuccess({
          token: localStorage.getItem("accessToken") || "",
          user: res.data,
        })
      )
    } catch (err: unknown) {
      console.error("Ошибка при восстановлении сессии:", err)

      if (
        typeof err === "object" &&
        err !== null &&
        "_handledByInterceptor" in err
      ) {
        dispatch(logout())
      }
    } finally {
      dispatch(finishRestore())
    }
  }

  restoreSession()
}, [dispatch])




  if (isLoading) {
    return <div>Загрузка приложения...</div>
  }

  console.log("App render — isLoading:", isLoading)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={<PrivateRoute component={TodoListPage} />}
        />
        <Route
          path="userProfile"
          element={<PrivateRoute component={ProfilePage} />}
        />
        <Route
          path="auth"
          element={<Auth />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App





