import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Profile } from "../types/auth"

const loadStateFromLocalStorage = (): Pick<
  AuthState,
  "accessToken" | "user"
> => {
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
  isLoading: boolean
}

const loadedState = loadStateFromLocalStorage()

const initialState: AuthState = {
  accessToken: loadedState.accessToken,
  user: loadedState.user,
  isAuthenticated: !!(loadedState.accessToken && loadedState.user),
  isLoading: true,
  // ...loadedState,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string
        refreshToken: string
        user: Profile
      }>
    ) {
      state.isAuthenticated = true
      state.accessToken = action.payload.token
      state.user = action.payload.user
      state.isLoading = false

      localStorage.setItem("accessToken", action.payload.token)
      localStorage.setItem("refreshToken", action.payload.refreshToken)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.isAuthenticated = false
      state.accessToken = null
      state.user = null
      state.isLoading = false

      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
    },
    restoreAuthSuccess(
      state,
      action: PayloadAction<{ token: string; user: Profile }>
    ) {
      state.isAuthenticated = true
      state.accessToken = action.payload.token
      state.user = action.payload.user
      // state.isLoading = false

      localStorage.setItem("accessToken", action.payload.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },
    startRestore(state) {
      state.isLoading = true
    },
    finishRestore(state) {
      state.isLoading = false
    },
  },
})

export const {
  login,
  logout,
  restoreAuthSuccess,
  startRestore,
  finishRestore,
} = authSlice.actions

export default authSlice.reducer
