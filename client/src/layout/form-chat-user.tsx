'use client';

import UserContext from "@/context/context";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IProps {
	user: any;
	dataMess: any;
	onSubmit: Function;
}

export default function FormChatUser({ user, dataMess, onSubmit }: IProps) {
	const current = useContext(UserContext);
	const [socket, setSocket] = useState<any>();
	const [message, setMessage] = useState<any>('');
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const handleSendMessage = async () => {
		socket.emit('sendMessage', {
			senderId: current?.id,
			receiverId: user._id,
			content: message,
			type: 'text',
		});
		setMessage('');
		setHasNewMessage(true);
		onSubmit();
	};
	useEffect(() => {
		onSubmit();
		const socket = io("http://localhost:3002");
		setSocket(socket);

		if (message !== "") {
			socket.on("message", (event) => {
				const data = JSON.parse(event.data);
				const { senderId, receiverId, content, type } = data;

				if (receiverId === user?._id) {
					setMessage((prevMessages: any) => [...prevMessages, data]);
					if (hasNewMessage) {
						setTimeout(() => {
							// loadMessageMe();
							onSubmit();
						}, 3000)
						setHasNewMessage(false);
					}
				}
			});
		}
	}, [message])

	// console.log(hasNewMessage)

	if (hasNewMessage) {
		setTimeout(() => {
			// loadMessageMe();
			onSubmit();
		}, 3000)
		setHasNewMessage(false);
	}

	return (
		<div className="flex-1 bg-white p-4">
			<div className="flex items-center mb-4">
				<img src="https://avatars.githubusercontent.com/u/123456789?v=4" alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
				<h3 className="font-semibold">{user?.fullname}</h3>
			</div>

			<div className="bg-gray-200 p-4 rounded-lg">
				<div className="overflow-y-scroll scroll-bottom" style={{ height: "400px" }}>
					{dataMess?.map((message: any) => (
						<>
							<div className="message">
								<div className="flex mb-2">
									<div className="bg-gray-300 rounded-lg p-2 max-w-xs break-words">
										{message?.sender !== current?.id && message?.content}
									</div>
								</div>
							</div>

							<div className="message">
								<div className="flex flex-row-reverse mb-2">
									<div className="bg-blue-500  text-white rounded-lg p-2 max-w-xs break-words">
										{message?.sender === current?.id && message?.content}
									</div>
								</div>
							</div>
						</>
					))}
				</div>

				<div className="flex mt-4">
					<input id="input" value={message} onChange={e => setMessage(e.target.value)} type="text" placeholder="Nhập tin nhắn" className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500" />
					<button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Gửi</button>
				</div>
			</div>
		</div>
	)
}