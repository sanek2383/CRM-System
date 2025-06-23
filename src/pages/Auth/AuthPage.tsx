// import { useState } from 'react'
// import styles from './Auth.module.css'
// import illustration from '../../../public/illustration.jpg'
// import RegisterForm from '../../components/RegisterForm/RegisterForm'
// import LoginForm from '../../components/LoginForm/LoginForm'

// const AuthPage = () => {
// 	const [mode, setMode] = useState<'login' | 'register' >('login')

// 	const renderForm = () => {
// 		switch (mode) {
// 			case 'register':
// 				return <RegisterForm onSwitchMode={() => setMode('login')} />
// 			case 'login':
// 			default:
// 				return (
// 					<LoginForm
// 						onSwitchToRegister={() => setMode('register')}
// 					/>
// 				)
// 		}
// 	}

// 	return (
// 		<div className={styles.authorizationContainer}>
// 			<div className={styles.imageAuthorization}>
// 				<img
// 					src={illustration}
// 					alt='illustration'
// 				/>
// 			</div>
// 			<div className={styles.formAuthorization}>{renderForm()}</div>
// 		</div>
// 	)
// }

// export default AuthPage

import { Outlet } from 'react-router-dom'
import styles from './Auth.module.css'
import illustration from '../../../public/illustration.jpg'

const AuthPage = () => {
	return (
		<div className={styles.authorizationContainer}>
			<div className={styles.imageAuthorization}>
				<img
					src={illustration}
					alt='illustration'
				/>
			</div>
			<div className={styles.formAuthorization}>
				<Outlet />
			</div>
		</div>
	)
}

export default AuthPage
