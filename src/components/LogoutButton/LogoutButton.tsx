import { useNavigate } from "react-router-dom"
import { Button } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { logout } from "../../api/apiToken"

const LogoutButton: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout() 
    navigate("/auth", { replace: true }) 

    window.dispatchEvent(new Event("storage"))
  }

  return (
    <Button
      type="default"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{ width: "100%" }}
    >
      Выйти
    </Button>
  )
}

export default LogoutButton
