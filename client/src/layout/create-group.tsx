'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import cookie from 'js-cookie';

const FormCreateGroup = () => {
	const route = useRouter();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const token = cookie.get('token');
	const handleCreateGroup = async (e: any) => {
		e.preventDefault();
		try {
			setLoading(true)
			await axios.post(`${process.env.URL}/group`, { name }, {
				headers: {
					token
				}
			});
			setLoading(false);
			route.push("/group");
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	return (
		<form method="post" onSubmit={handleCreateGroup}>
			<div className="flex justify-between">
				<input
					placeholder="Tên nhóm"
					type="text"
					value={name}
					name="name"
					onChange={(e: any) => setName(e.target.value)}
					className="w-full px-3 py-2 border-2 rounded-lg"
				/>
				<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Tạo nhóm</button>
			</div>
			<a href="/group">
				<button className="bg-gray-500 text-white py-2 px-4 rounded-lg">Trở về</button>
			</a>
		</form>
	);
};

export default FormCreateGroup;