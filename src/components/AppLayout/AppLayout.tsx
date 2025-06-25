import { Outlet } from 'react-router-dom'
import MainMenu from '../../pages/MainMenu'

const AppLayout = () => {
	return (
		<>
			<MainMenu />
			<div className='content'>
				<Outlet />
			</div>
		</>
	)
}

export default AppLayout
