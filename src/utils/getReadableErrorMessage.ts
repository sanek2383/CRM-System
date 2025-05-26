import { AxiosError } from "axios"

export function getReadableErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const code = error.response?.data?.code
    const message = error.response?.data?.message

    switch (status) {
      case 400:
        if (typeof message === "string") {
          if (message.includes("PhoneNumber")) {
            return "Некорректный номер телефона. Введите его в формате +7XXXXXXXXXX"
          }
          return message // Показываем любое другое серверное сообщение
        }
        return "Неверные данные. Пожалуйста, проверьте форму."

      case 401:
        if (code === "auth/invalid-credentials") {
          return "Неверный логин или пароль"
        }
        if (code === "auth/token-missing") {
          return "Сессия истекла. Авторизуйтесь заново."
        }
        return "Вы не авторизованы. Попробуйте войти снова."

      case 403:
        return "Доступ запрещён."
      case 404:
        return "Ресурс не найден."
      case 409:
        return "Конфликт: возможно, такой логин уже существует, попробуйте ввести новый."
      case 500:
        return "Ошибка сервера. Попробуйте позже."

      default:
        return `Ошибка ${status ?? ""}: ${message ?? "Что-то пошло не так"}`
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Произошла неизвестная ошибка. Попробуйте позже."
}
