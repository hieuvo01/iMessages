'use client'

import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'


export default function Verify() {
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const route = useRouter();
	const onFinish = async (event: any) => {
		event.preventDefault();

		const params = {
			email: email,
			otp: Number(otp)
		};
		try {
			const response = await axios.post(`${process.env.URL}/user/verify`, params);
			route.push('/login');
		} catch (error) {
			alert("Không thể xác thực tài khoản của bạn!");
		}
	};
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="w-full max-w-md">
				<form className="bg-white p-8 shadow-md rounded-lg" onSubmit={onFinish}>
					<h2 className="text-2xl font-semibold mb-6 text-center">Xác nhận mã OTP</h2>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ email:</label>
						<input type="email" id="email" value={email}
							onChange={(event) => setEmail(event.target.value)} name="email" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Email" required />
					</div>
					<div className="mb-6">
						<label htmlFor="Otp" className="block text-gray-700 text-sm font-bold mb-2">Mã xác minh:</label>
						<input type="text" id="Otp" value={otp}
							onChange={(event) => setOtp(event.target.value)} name="Otp" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Mã OTP" required />
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Gửi</button>
					</div>
				</form>
			</div>
		</div>
	)
}