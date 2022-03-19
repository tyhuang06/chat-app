import { useEffect, useState } from 'react';
import axiosDefault from '../axios';

const ChatPage = () => {
	const [chats, setChats] = useState([]);

	const fetchChats = async () => {
		const { data } = await axiosDefault.get('/chat');
		setChats(data);
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return (
		<div>
			{chats.map((chat) => (
				<div key={chat._id}>{chat.chatName}</div>
			))}
		</div>
	);
};

export default ChatPage;
