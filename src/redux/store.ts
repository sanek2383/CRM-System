import { configureStore } from '@reduxjs/toolkit'
import authReducer from './sessionSlice'
import adminUserTableReducer from './adminUserTableSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		adminUserTable: adminUserTableReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
