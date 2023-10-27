'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import cookie from 'js-cookie';
export default function Main() {
	const [dataUser, setDataUser] = useState<any>();
	const token = cookie.get('token');

	const loadDataUsers = async () => {
		try {
			const data = await axios.get(`${process.env.URL}/user/get-all`, {
				headers:{
					token
				}
			});
			setDataUser(data);
		} catch (error) {
			alert(error)
		}
	}

	useEffect(()=>{
		loadDataUsers();
	},[])

	console.log(dataUser.data)
	return (
		<div className="bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-4">Tin Nhắn</h1>

				<div className="flex">
					<div className="w-1/4 bg-white p-4 mr-4">
						<h2 className="text-lg font-semibold mb-2">Danh sách liên hệ</h2>
						<ul>
							{dataUser.data.map((items: any)=>(
								<li className="py-2 hover:bg-gray-200 cursor-pointer">{items.fullname}</li>
							))}
						</ul>
					</div>

					<div className="flex-1 bg-white p-4">
						<div className="flex items-center mb-4">
							<img src="avatar.png" alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
							<h3 className="font-semibold">Người dùng 1</h3>
						</div>

						<div className="bg-gray-200 p-4 rounded-lg">
							<div className="message">
								<div className="flex mb-2">
									<div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs break-words">
										Xin chào!
									</div>
								</div>
								<div className="flex mb-2">
									<div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs break-words">
										Có điều gì bạn cần trợ giúp không?
									</div>
								</div>
							</div>

							<div className="message">
								<div className="flex flex-row-reverse mb-2">
									<div className="bg-gray-300 rounded-lg p-2 max-w-xs break-words">
										Chào! Tôi có một câu hỏi về sản phẩm của bạn.
									</div>
								</div>
							</div>

							<div className="flex mt-4">
								<input type="text" placeholder="Nhập tin nhắn" className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500" />
								<button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Gửi</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}