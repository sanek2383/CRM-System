import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authApi, { setAccessToken } from '../api/authApi'
import {
	restoreAuthSuccess,
	logout,
	startRestore,
	finishRestore,
} from '../redux/sessionSlice'
import axios from 'axios'
import { Token } from '../types/auth'

export const useRestoreSession = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const restoreSession = async () => {
			dispatch(startRestore())

			const refreshToken = localStorage.getItem('refreshToken')
			if (!refreshToken) {
				dispatch(logout())
				return
			}

			try {
				const resRefresh = await axios.post<Token>(
					'https://easydev.club/api/v1/auth/refresh',
					{
						refreshToken,
					}
				)

				const { accessToken, refreshToken: newRefreshToken } = resRefresh.data
				setAccessToken(accessToken)
				localStorage.setItem('refreshToken', newRefreshToken)

				try {
					const resProfile = await authApi.get('/user/profile')
					dispatch(restoreAuthSuccess({ user: resProfile.data }))
				} catch (profileError) {
					console.error('Ошибка получения профиля:', profileError)
					dispatch(logout())
				}
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
