import React from "react"
import { useDispatch } from "react-redux"
import { restoreAuthSuccess } from "../../redux/authSlice"

interface Props {
  children: React.ReactNode
}

const RootApp: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const userStr = localStorage.getItem("user")

    if (token && userStr && userStr !== "undefined") {
  try {
    const user = JSON.parse(userStr)
    dispatch(restoreAuthSuccess({ token, user }))
  } catch (e) {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
  }
}
  }, [dispatch])

  return <>{children}</>
}

export default RootApp
