import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import TodoListPage from "./pages/TodoListPage/TodoListPage"
import ProfilePage from "./pages/UserProfile/ProfilePage"
import Auth from "./pages/Auth/Auth"
import PrivateRoute from "./pages/Auth/PrivateRoute"
import { useDispatch, } from "react-redux"
import { useEffect, useState } from "react"
import authApi from "./api/apiToken"
import { restoreAuthSuccess, logout } from "./redux/authSlice"
import { Profile } from "./types/auth"

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const restoreSession = async () => {
    try {
      const res = await authApi.get<Profile>("/user/profile")
      const token = localStorage.getItem("accessToken")

      if (!token) {       
        console.warn("Профиль получен, но токена нет.")
        return dispatch(logout())
      }

      dispatch(restoreAuthSuccess({ token, user: res.data }))
    } catch (err) {
      console.error("Не удалось восстановить сессию:", err)
      dispatch(logout())
    } finally {
      setIsLoading(false)
    }
  }

  restoreSession()
}, [dispatch])

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PrivateRoute component={TodoListPage} />} />
        <Route path="userProfile" element={<PrivateRoute component={ProfilePage} />} />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

