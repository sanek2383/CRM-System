import { createContext } from "react"
import { Profile } from "../types/auth"

export type AuthContextType = {
  isAuthenticated: boolean
  user: Profile | null
  login: (token: string, userData: Profile) => void
  logout: () => void
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined)
