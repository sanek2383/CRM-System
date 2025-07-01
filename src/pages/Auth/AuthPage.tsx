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
