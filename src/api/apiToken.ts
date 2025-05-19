import axios from "axios"
import { Token } from "../types/auth"
import { api } from "./axiosInstance"

type FailedQueueItem = {
  reject: (error: unknown) => void
  resolve: (token: string | null) => void
}

const authApi = axios.create({
  baseURL: "https://easydev.club/api/v1",
})

// Добавляю токен перед каждым запросом
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка истекшего токена
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token
            return authApi(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          return Promise.reject(new Error("Refresh token not found"))
        }

        const res = await axios.post<Token>(
          "https://easydev.club/api/v1/auth/refresh",
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = res.data

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

        processQueue(null, accessToken)
        return authApi(originalRequest)
      } catch (err) {
        processQueue(err)
        return Promise.reject(err)
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
      "https://easydev.club/api/v1/user/logout ",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  } catch (error) {
    console.error("Ошибка выхода:", error)

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }
}

export default authApi
