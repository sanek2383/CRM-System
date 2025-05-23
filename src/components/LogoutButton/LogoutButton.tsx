import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, message } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { logout } from "../../api/apiToken"

const LogoutButton: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      navigate("/auth", { replace: true })
      // window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Ошибка при выходе:", error)
      message.error("Не удалось выйти. Попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="default"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{ width: "100%" }}
      loading={loading}
    >
      Выйти
    </Button>
  )
}

export default LogoutButton

