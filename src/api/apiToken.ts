import axios from "axios"
import { AxiosError } from "axios"
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
          if (originalRequest.url.includes("/signin")) {
            return Promise.reject(
              new AxiosError(
                "Неверный логин или пароль",
                "ERR_BAD_REQUEST",
                originalRequest,
                null,
                {
                  status: 401,
                  statusText: "Unauthorized",
                  data: {
                    message: "Неверный логин или пароль",
                    code: "auth/invalid-credentials",
                  },
                  headers: {},
                  config: originalRequest,
                }
              )
            )
          }

          return Promise.reject({
            response: {
              status: 401,
              data: {
                message: "Сессия истекла. Авторизуйтесь заново.",
                code: "auth/token-missing",
              },
              config: originalRequest,
            },
          })
        }

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
        processQueue(err)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/auth"
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
