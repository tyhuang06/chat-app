import { useEffect, useState } from 'react';
import axiosDefault from '../axios';
import SideDrawer from '../components/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
	const { user } = ChatState();

	return (
		<div className="w-full flex flex-col">
			<div>{user && <SideDrawer />}</div>
			<div className="flex justify-between m-3 h-full">
				{user && <MyChats />}
				{user && <ChatBox />}
			</div>
		</div>
	);
};

export default ChatPage;
