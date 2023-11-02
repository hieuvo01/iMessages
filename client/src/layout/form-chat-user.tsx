'use client';

import UserContext from "@/context/context";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IProps {
	user: any;
}

export default function FormChatUser({ user }: IProps) {
	const current = useContext(UserContext);
	const [socket, setSocket] = useState<any>();
	const [loadMessSend, setLoadMessSend] = useState<any>();
	const [loadMessMe, setLoadMessMe] = useState<any>();
	const [message, setMessage] = useState<any>('');
	const handleSendMessage = async () => {
		socket.emit('sendMessage', {
			senderId: current?.id,
			receiver: user._id,
			content: message,
			type: 'text',
		});
	};

	const params = {
		senderId: current?.id,
		receiverId: user?._id
	};

	const loadMessageMe = async () => {
		try {
			const data = await axios.post(`${process.env.URL}/group/get-message`, params);
			setLoadMessMe(data)
		} catch (error) {
			console.log(error);
		}
	};
	const loadMessageSend = async () => {
		try {
			const data = await axios.post(`${process.env.URL}/group/get-message`, user._id);
			setLoadMessSend(data)
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		const socket = io("http://localhost:3002");
		setSocket(socket);
		loadMessageMe();
		// loadMessageSend();
	}, [])
	// console.log(loadMessSend)
	console.log(loadMessMe)
	return (
		<div className="flex-1 bg-white p-4">
			<div className="flex items-center mb-4">
				<img src="https://avatars.githubusercontent.com/u/123456789?v=4" alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
				<h3 className="font-semibold">{user?.fullname}</h3>
			</div>

			<div className="bg-gray-200 p-4 rounded-lg">
				<div className="message">
					<div className="flex mb-2">
						<div className="bg-gray-300 rounded-lg p-2 max-w-xs break-words">
							Có điều gì bạn cần trợ giúp không?
						</div>
					</div>
				</div>

				<div className="message">
					<div className="flex flex-row-reverse mb-2">
						<div className="bg-blue-500  text-white rounded-lg p-2 max-w-xs break-words">
							Chào! Tôi có một câu hỏi về sản phẩm của bạn.
						</div>
					</div>
				</div>

				<div className="flex mt-4">
					<input id="input" onChange={e => setMessage(e.target.value)} type="text" placeholder="Nhập tin nhắn" className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500" />
					<button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Gửi</button>
				</div>
			</div>
		</div>
	)
}