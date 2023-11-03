'use client'

import axios from "axios";
import { useState } from "react";
import cookie from 'js-cookie'
import socket from 'socket.io-client';

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
			alert("Đăng nhập thành công, đang chuyển hướng ...");
			window.location.href = '/';
			// socket.on
		} catch (error) {
			alert("Đăng nhập thất bại, vui lòng thử lại..");
		}
	};
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="w-full max-w-md">
				<form className="bg-white p-8 shadow-md rounded-lg" onSubmit={onFinish}>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
						<div className="sm:mx-auto sm:w-full sm:max-w-md">
							<img src="" alt="logo" height={48} width={48} className="mx-auto w-20" srcSet="/images/logo.png"/>
						</div>
					</div>
					<h2 className="text-3xl font-bold mb-6 text-center">Đăng Nhập</h2>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ email:</label>
						<input type="email" id="email" name="email" value={email}
							onChange={(event) => setEmail(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Email" required />
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu:</label>
						<input type="password" id="password" value={password}
							onChange={(event) => setPassword(event.target.value)} name="password" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Password" required />
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Đăng Nhập</button>
						<a href="#" className="text-gray-600 hover:text-indigo-500 text-sm">Quên mật khẩu?</a>
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"></button>
						<a href="/register" className="text-gray-600 hover:text-indigo-500 text-sm">Đăng ký</a>
					</div>
				</form>
			</div>
		</div>
	)
}