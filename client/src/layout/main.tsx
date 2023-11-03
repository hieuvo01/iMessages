'use client'

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import cookie from 'js-cookie';
import { io } from "socket.io-client";
import FormChatUser from "./form-chat-user";
import UserContext from "@/context/context";
export default function Main() {
	const [dataUser, setDataUser] = useState<any>();
	const [user, setUser] = useState<any>();
	const token = cookie.get('token');
	const [loadMessMe, setLoadMessMe] = useState<any>();
	const [checkMess, setCheckMess] = useState<any>(false);
	const current = useContext(UserContext);

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

	const params = {
		senderId: current?.id,
		receiverId: user?._id
	};

	const loadMessageMe = async () => {
		try {
			const data = await axios.post(`${process.env.URL}/group/get-message`, params);
			setLoadMessMe(data.data)
			setCheckMess(true);
		} catch (error) {
			console.log(error);
		}
	};


	const handleGetForm = async (items: any) => {
		setUser(items)
		await loadMessageMe();
	}
	console.log(loadMessMe)

	useEffect(() => {
		loadDataUsers();
		loadMessageMe();
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
					{checkMess && <FormChatUser user={user} dataMess={loadMessMe} />}
				</div>
			</div>
		</div>
	)



}