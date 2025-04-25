import { BrowserRouter, Routes, Route } from "react-router"

import "./App.css"
import TodoListPage from "./pages/TodoListPage.tsx"
import TodoNavigationPage from "./pages/TodoNavigationPage.tsx"
import UserProfile from "./pages/UserProfile.tsx"

function App() {

  return (
    <BrowserRouter>
        <TodoNavigationPage/>
      <Routes>
        <Route
          index
          element={<TodoListPage />}
        />
        <Route
          path="userProfile"
          element={<UserProfile />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
