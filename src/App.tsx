import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./pages/Auth/AuthProvider"
import "./App.css"
import TodoListPage from "./pages/TodoListPage/TodoListPage"
import TodoNavigationPage from "./pages/TodoNavigationPage"
import ProfilePage from "./pages/UserProfile/ProfilePage.tsx"
import Auth from "./pages/Auth/Auth"
import PrivateRoute from "./pages/Auth/PrivateRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TodoNavigationPage />
        <Routes>
          {/* защищённые маршруты */}
          <Route
            index
            element={
              <PrivateRoute>
                <TodoListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="userProfile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* общедоступная авторизация */}
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
    </AuthProvider>
  )
}

export default App
