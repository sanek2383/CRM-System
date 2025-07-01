import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authApi from '../api/authApi'
import {
	restoreAuthSuccess,
	logout,
	startRestore,
	finishRestore,
} from '../redux/sessionSlice'

export const useRestoreSession = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const restoreSession = async () => {
			dispatch(startRestore())

			const token = localStorage.getItem('refreshToken')
			if (!token) {
				dispatch(logout())
				return
			}

			try {
				const res = await authApi.get('/user/profile')
				dispatch(restoreAuthSuccess({ user: res.data }))
			} catch (err) {
				console.error('Ошибка восстановления сессии:', err)
				dispatch(logout())
			} finally {
				dispatch(finishRestore())
			}
		}

		restoreSession()
	}, [dispatch])
}