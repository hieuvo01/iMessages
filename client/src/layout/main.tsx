'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import cookie from 'js-cookie';
import { io } from "socket.io-client";
import FormChatUser from "./form-chat-user";
export default function Main() {
	const [dataUser, setDataUser] = useState<any>();
	const [user, setUser] = useState<any>();
	const token = cookie.get('token');

	const loadDataUsers = async () => {
		try {
			const data = await axios.get(`${process.env.URL}/user/get-all`, {
				headers: {
					token
				}
			});
			setDataUser(data);
		} catch (error) {
			alert(error)
		}
	}

	const handleGetForm = (items: any) => {
		setUser(items)
	}

	useEffect(() => {
		loadDataUsers();
	}, [])

	return (
		<div className="bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-4">Tin Nhắn</h1>
				<div className="flex">
					<div className="w-1/4 bg-white p-4 mr-4">
						<h2 className="text-lg font-semibold mb-2">Danh sách liên hệ</h2>
						<ul>
							{dataUser?.data.map((items: any) => (
								<li className="py-2 hover:bg-gray-200 cursor-pointer" key={items}>
									<button onClick={() => handleGetForm(items)}>{items.fullname}</button>
								</li>
							))}
						</ul>
					</div>
					<FormChatUser user={user} />
				</div>
			</div>
		</div>
	)



}