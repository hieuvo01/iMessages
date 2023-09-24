'use client';
import axios from "axios"
import { useState } from "react";

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullname, setFullname] = useState('');
	const [gender, setGender] = useState('');
	const [dod, setDod] = useState('');

	const onFinish = async (event: any) => {
		event.preventDefault();

		const params = {
			email: email,
			password: password,
			fullname: fullname,
			gender: gender,
			dod: dod
		};
		try {
			const response = await axios.post(`${process.env.URL}/user/register`, params);
			window.location.href = '/verify-otp';
		} catch (error) {
			alert("Could not register !!!");
		}
	};
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="w-full max-w-md">
				<form className="bg-white p-8 shadow-md rounded-lg" onSubmit={onFinish}>
					<h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
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
					<div className="mb-6">
						<label htmlFor="fullname" className="block text-gray-700 text-sm font-bold mb-2">Fullname</label>
						<input type="text" id="fullname" value={fullname}
							onChange={(event) => setFullname(event.target.value)} name="fullname" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Fullname" required />
					</div>
					<div className="mb-6">
						<label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
						<input type="text" id="gender" value={gender}
							onChange={(event) => setGender(event.target.value)} name="gender" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Gender" required />
					</div>
					<div className="mb-6">
						<label htmlFor="dod" className="block text-gray-700 text-sm font-bold mb-2">Birth</label>
						<input type="text" id="dod" value={dod}
							onChange={(event) => setDod(event.target.value)} name="dod" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" placeholder="Dod" required />
					</div>
					<div className="flex items-center justify-between">
						<button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
						<a href="/login" className="text-gray-600 hover:text-indigo-500 text-sm">Login</a>
					</div>
				</form>
			</div>
		</div>
	)
}