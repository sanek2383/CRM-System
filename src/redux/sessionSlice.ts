import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../types/auth'


export interface AuthState {
	isAuthenticated: boolean | null
	user: Profile | null
	isLoading: boolean
	isRestoring: boolean
}

const loadStateFromLocalStorage = (): Pick<AuthState, 'user'> => {
	return { user: null }
}


const loadedState = loadStateFromLocalStorage()

const initialState: AuthState = {
	user: loadedState.user,
	isAuthenticated: null,
	isLoading: true,
	isRestoring: true,
}

const sessionSlice = createSlice({
	name: 'auth',
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
			state.user = action.payload.user
			state.isLoading = false
			localStorage.setItem('refreshToken', action.payload.refreshToken)
		},
		logout(state) {
			state.isAuthenticated = false
			state.user = null
			state.isLoading = false
			state.isRestoring = false
			localStorage.removeItem('refreshToken')
		},
		restoreAuthSuccess(state, action: PayloadAction<{ user: Profile }>) {
			state.isAuthenticated = true
			state.user = action.payload.user
		},
		startRestore(state) {
			state.isLoading = true
		},
		finishRestore(state) {
			state.isLoading = false
		},
	},
})

export const { login, logout, restoreAuthSuccess, startRestore, finishRestore } =
	sessionSlice.actions

export default sessionSlice.reducer
