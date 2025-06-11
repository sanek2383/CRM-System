import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import {
  Card,
  Descriptions,
  Spin,
  Typography,
  Avatar,
  Tag,
  Divider,
} from "antd"
import {
  UserOutlined,
  MailOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons"
import authApi from "../../api/apiToken"
import { Profile } from "../../types/auth"

const { Title } = Typography

const fetchUserProfile = async (): Promise<Profile> => {
  const response = await authApi.get("/user/profile")
  return response.data
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile()
        setUser(data)
      } catch (err) {
        console.error("Ошибка загрузки профиля", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "40px auto" }}
      />
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return (
		<div style={{ maxWidth: 700, margin: '40px auto', padding: '20px' }}>
			<Card
				variant='outlined'
				styles={{
					body: {
						padding: '2rem',
					},
				}}
				style={{
					width: '40rem',
					zIndex: 1,
					borderRadius: 16,
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
					transition: 'box-shadow 0.3s ease',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: '24px' }}>
					<Avatar
						size={80}
						icon={<UserOutlined />}
						style={{ backgroundColor: '#1890ff', fontSize: '24px' }}
					/>
					<Title
						level={3}
						style={{ marginTop: 16 }}
					>
						{user.username}
					</Title>
					<div style={{ marginTop: 8 }}>
						{user.roles.map(role => (
							<Tag
								key={role}
								color='blue'
								style={{ fontSize: '12px', marginBottom: 8 }}
							>
								{role}
							</Tag>
						))}
					</div>
					<p style={{ color: '#666', marginTop: 8 }}>
						<MailOutlined /> {user.email}
					</p>
				</div>

				<Divider />

				<Descriptions
					layout='vertical'
					items={[
						{
							key: 'id',
							label: 'ID',
							children: user.id,
						},
						{
							key: 'date',
							label: 'Дата регистрации',
							children: new Date(user.date).toLocaleDateString(),
						},
						{
							key: 'phone',
							label: 'Номер телефона',
							children: user.phoneNumber || (
								<span style={{ color: '#aaa' }}>Не указан</span>
							),
						},
						{
							key: 'status',
							label: 'Статус',
							children: user.isBlocked ? (
								<Tag
									icon={<LockOutlined />}
									color='error'
								>
									Заблокирован
								</Tag>
							) : (
								<Tag
									icon={<ClockCircleOutlined />}
									color='success'
								>
									Активен
								</Tag>
							),
						},
					]}
					styles={{
						label: {
							fontWeight: 600,
							width: 150,
						},
					}}
				/>
			</Card>
		</div>
	)
}

export default ProfilePage
