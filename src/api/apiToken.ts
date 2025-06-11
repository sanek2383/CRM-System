import axios from 'axios'
import { store } from '../redux/store'
import { Token } from '../types/auth'
import { logout as reduxLogout } from '../redux/sessionSlice'

const authApi = axios.create({
	baseURL: 'https://easydev.club/api/v1',
})

let currentAccessToken: string | null = null

const updateAuthHeader = (token: string | null) => {
	if (token) {
		authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
	} else {
		delete authApi.defaults.headers.common['Authorization']
	}
}

export const setAccessToken = (token: string | null) => {
	currentAccessToken = token
	updateAuthHeader(token)
}

authApi.interceptors.request.use(config => {
	if (currentAccessToken) {
		config.headers.Authorization = `Bearer ${currentAccessToken}`
	}
	return config
})

authApi.interceptors.response.use(
	response => {
		console.log('Response:', response)
		return response
	},
	async error => {
		console.log('Response error:', error.response)
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

				updateAuthHeader(accessToken)
				setAccessToken(accessToken)
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

export const logout = async () => {
	const token = currentAccessToken

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
