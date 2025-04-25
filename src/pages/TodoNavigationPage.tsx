import { useState } from "react"
import { NavLink } from "react-router"
import {
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Button, Menu } from "antd"
import styles from "./TodoListPage.module.css"

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
  { key: "1", icon: <ContainerOutlined />, label: <NavLink to="/">Список задач</NavLink>, },
  { key: "2", icon: < PieChartOutlined/>, label: <NavLink to="/userProfile">Профиль</NavLink>, },
]

const TodoNavigationPage = () => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <>
      <aside className={styles.aside} style={{ width: 256 }}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          className={styles.buttonMenuAside}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
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
