import { useEffect, useState } from 'react';
import axiosDefault from '../axios';
import SideDrawer from '../components/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);

	return (
		<div className="w-full flex flex-col max-h-screen">
			<div>{user && <SideDrawer />}</div>
			<div className="flex justify-between m-3 h-screen overflow-hidden">
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox
						fetchAgain={fetchAgain}
						setFetchAgain={setFetchAgain}
					/>
				)}
			</div>
		</div>
	);
};

export default ChatPage;
