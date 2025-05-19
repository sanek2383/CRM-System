import { useState, ReactNode, useEffect } from "react"
import { AuthContext } from "../../utils/authContext"
import { Profile } from "../../types/auth"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  )

  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData || userData === "undefined") return null
      return JSON.parse(userData) as Profile
    } catch {
      return null
    }
  })

  // Синхронизация состояния с localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsAuthenticated(!!token)
  }, [])

  // Подписка на изменения localStorage (например, logout в другом компоненте)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken")
      setIsAuthenticated(!!token)

      const userData = localStorage.getItem("user")
      try {
        setUser(userData ? JSON.parse(userData) : null)
      } catch {
        setUser(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const login = (token: string, userData: Profile) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
