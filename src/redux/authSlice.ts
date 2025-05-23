import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Profile } from "../types/auth"

const loadStateFromLocalStorage = (): Pick<AuthState, "accessToken" | "user"> => {
  try {
    const token = localStorage.getItem("accessToken")
    const userStr = localStorage.getItem("user")

    if (token && userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr)
        return { accessToken: token, user }
      } catch (e) {
        console.error("Failed to parse user JSON", e)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
      }
    }
  } catch (e) {
    console.error("Failed to load auth state from localStorage", e)
  }

  return { accessToken: null, user: null }
}

export interface AuthState {
  isAuthenticated: boolean
  user: Profile | null
  accessToken: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  ...loadStateFromLocalStorage(),
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: Profile }>) {
      state.isAuthenticated = true
      state.accessToken = action.payload.token
      state.user = action.payload.user

      localStorage.setItem("accessToken", action.payload.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.isAuthenticated = false
      state.accessToken = null
      state.user = null

      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
    },
    restoreAuthSuccess(
      state,
      action: PayloadAction<{ token: string; user: Profile }>
    ) {
      state.isAuthenticated = true
      state.accessToken = action.payload.token
      state.user = action.payload.user
    },
  },
})

export const { login, logout, restoreAuthSuccess } = authSlice.actions
export default authSlice.reducer
