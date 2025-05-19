import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Button, Menu } from "antd"
import styles from "./TodoListPage/TodoListPage.module.css"
import { useAuth } from "../utils/useAuth"
import LogoutButton from "../components/LogoutButton/LogoutButton"

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
  {
    key: "1",
    icon: <ContainerOutlined />,
    label: <NavLink to="/">Список задач</NavLink>,
  },
  {
    key: "2",
    icon: <PieChartOutlined />,
    label: <NavLink to="/userProfile">Профиль</NavLink>,
  },
  // { key: "3", label: <NavLink to="/auth">Авторизация</NavLink> },
  {
    key: "logout",
    label: <LogoutButton />,
    style: { marginTop: "auto" },
  },
]

const TodoNavigationPage = () => {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState("1")
  const location = useLocation()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    const currentPath = location.pathname

    let activeKey = "1"

    if (currentPath === "/") activeKey = "1"
    else if (currentPath === "/userProfile") activeKey = "2"
    else if (currentPath === "/auth") activeKey = "3"

    setSelectedKey(activeKey)
  }, [location.pathname])

  if (!isAuthenticated) return null

  return (
    <>
      <aside
        className={styles.aside}
        style={{ width: 256 }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          className={styles.buttonMenuAside}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          selectedKeys={[selectedKey]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
        />
      </aside>
    </>
  )
}

export default TodoNavigationPage
