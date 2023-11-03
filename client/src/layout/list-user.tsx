import UserContext from "@/context/context";
import axios from "axios";
import { useContext, useState } from "react";

interface IProps {
	items: any;
	onSubmit: Function;
}

export default function ListUsers({ items, onSubmit }: IProps) {
	const current = useContext(UserContext);
	const [socket, setSocket] = useState<any>();
	const [loadMessMe, setLoadMessMe] = useState<any>();
	const [checkMess, setCheckMess] = useState(false);
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
	return (
		<li className="py-2 hover:bg-gray-200 cursor-pointer click-message" key={items.fullname}>
			<button onClick={() => onSubmit(items)}>{items.fullname}</button>
		</li>
	)
}