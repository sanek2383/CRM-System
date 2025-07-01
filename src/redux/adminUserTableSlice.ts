import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AdminUserTableState {
	search: string
	page: number
	blockFilter: 'all' | 'blocked' | 'active'
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

const initialState: AdminUserTableState = {
	search: '',
	page: 1,
	blockFilter: 'all',
	sortBy: undefined,
	sortOrder: undefined,
}

const adminUserTableSlice = createSlice({
	name: 'adminUserTable',
	initialState,
	reducers: {
		setFilters(state, action: PayloadAction<Partial<AdminUserTableState>>) {
			Object.assign(state, action.payload)
		},
		resetFilters() {
			return initialState
		},
	},
})

export const { setFilters, resetFilters } = adminUserTableSlice.actions
export default adminUserTableSlice.reducer
