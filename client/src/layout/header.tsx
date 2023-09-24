'use client'

import cookie from 'js-cookie'
import { useContext } from 'react';
import UserContext from '../../context/context';

export default function Header() {
	const user = useContext(UserContext);
	const handleLogout = () => {
		cookie.remove('token');
		window.location.href = '/login';
	}
	return (
		<header className="flex items-center justify-between bg-gray-200 p-4">
			<div className="flex items-center">
				<img src="message-icon.png" alt="Message Icon" className="w-8 h-8" />
			</div>
			<div className="flex items-center space-x-2">
				<button className="text-blue-500 hover:text-blue-700">Thông báo</button>
				<div className="relative">
					<h3 className="text-gray-700 hover:text-gray-900">{user}</h3>
					<button className="absolute top-full left-0 w-full bg-white border border-gray-200 text-gray-700 py-2 hover:text-gray-900" onClick={handleLogout}>Logout</button>
				</div>
			</div>
		</header>
	)
}