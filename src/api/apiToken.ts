import axios from "axios"
import { Token } from "../types/auth"

type FailedQueueItem = {
  reject: (error: unknown) => void
  resolve: (token: string | null) => void
}

const authApi = axios.create({
  baseURL: "https://easydev.club/api/v1",
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: FailedQueueItem[] = []

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

authApi.interceptors.response.use(
  (response) => {
    console.log("Успешный ответ:", response)
    return response
  },
  async (error) => {
    console.log("Ответ с ошибкой:", error?.response?.status, error?.config?.url)
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Попытка рефреша токена")

      const refreshToken = localStorage.getItem("refreshToken")

      if (!refreshToken) {
        console.warn("Отсутствует refreshToken — выходим из системы")

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        return Promise.reject({ ...error, _handledByInterceptor: true })
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`
            return authApi(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post<Token>(
          "https://easydev.club/api/v1/auth/refresh",
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = res.data

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        authApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

        processQueue(null, accessToken)
        return authApi(originalRequest)
      } catch (err) {
        console.error("Не удалось обновить токен, выходим из системы")

        processQueue(err)

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        return Promise.reject({ ...error, _handledByInterceptor: true })
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export const logout = async () => {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    console.warn("Токен отсутствует — пользователь уже вышел")
    return Promise.resolve()
  }

  try {
    await axios.post(
      "https://easydev.club/api/v1/user/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error("Ошибка выхода:", error)
  } finally {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }
}

export default authApi
