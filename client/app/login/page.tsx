'use client'

import axios from "axios";
import { useState } from "react";
import cookie from 'js-cookie'
export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onFinish = async (event: any) => {
		event.preventDefault();

		const params = {
			email: email,
			password: password
		};
		try {
			const response = await axios.post(`${process.env.URL}/user/login`, params);

			cookie.set('token', response.data.token);
			alert("Login Success !!!");
			window.location.href = '/';
		} catch (error) {
			alert("Could not Login !!!");
		}
	};
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="w-full max-w-md">
				<form className="bg-white p-8 shadow-md rounded-lg" onSubmit={onFinish}>
					<h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
						<input type="email" id="email" name="email" value={email}
							onChange={(event) => setEmail(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Email" required />
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
						<input type="password" id="password" value={password}
							onChange={(event) => setPassword(event.target.value)} name="password" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Password" required />
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
						<a href="#" className="text-gray-600 hover:text-indigo-500 text-sm">Forgot Password?</a>
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="	hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"></button>
						<a href="/register" className="text-gray-600 hover:text-indigo-500 text-sm">Register</a>
					</div>
				</form>
			</div>
		</div>
	)
}