import axios from 'axios'
import { store } from '../redux/store'
import { Token } from '../types/auth'
import { logout as reduxLogout } from '../redux/sessionSlice'
import { tokenStorage } from '../utils/TokenStorage'

const authApi = axios.create({
	baseURL: 'https://easydev.club/api/v1',
})

authApi.interceptors.request.use(config => {
	const token = tokenStorage.get()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

authApi.interceptors.response.use(
	response => {
		return response
	},
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			const refreshToken = localStorage.getItem('refreshToken')

			if (!refreshToken) {
				store.dispatch(reduxLogout())
				return Promise.reject({ ...error, _handledByInterceptor: true })
			}

			try {
				const res = await axios.post<Token>(
					'https://easydev.club/api/v1/auth/refresh',
					{ refreshToken }
				)

				const { accessToken, refreshToken: newRefreshToken } = res.data

				tokenStorage.set(accessToken)
				localStorage.setItem('refreshToken', newRefreshToken)

				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
				originalRequest._retry = true

				return authApi(originalRequest)
			} catch (err) {
				console.error('Не удалось обновить токен, выходим из системы', err)
				localStorage.removeItem('refreshToken')
				store.dispatch(reduxLogout())
				return Promise.reject({ err })
			}
		}

		return Promise.reject(error)
	}
)

export const setAccessToken = (token: string | null) => {
	tokenStorage.set(token)
}

export const logout = async () => {
	const token = tokenStorage.get()

	if (!token) {
		console.warn('Токен отсутствует — пользователь уже вышел')
		return Promise.resolve()
	}

	try {
		await axios.post(
			'https://easydev.club/api/v1/user/logout',
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
	} catch (error) {
		console.error('Ошибка выхода:', error)
	} finally {
		localStorage.removeItem('refreshToken')
		store.dispatch(reduxLogout())
	}
}

export default authApi
