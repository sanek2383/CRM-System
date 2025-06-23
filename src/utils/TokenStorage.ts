import authApi from "../api/authApi"

class TokenStorage {
	#accessToken: string | null = null

	set(token: string | null) {
		this.#accessToken = token
		this.updateAuthHeader(token)
	}

	get(): string | null {
		return this.#accessToken
	}

	clear() {
		this.set(null)
	}

	private updateAuthHeader(token: string | null) {
		if (token) {
			this.authHeader = `Bearer ${token}`
		} else {
			this.authHeader = null
		}
	}

	private set authHeader(value: string | null) {
		if (value) {
			authApi.defaults.headers.common['Authorization'] = value
		} else {
			delete authApi.defaults.headers.common['Authorization']
		}
	}
}

export const tokenStorage = new TokenStorage()
