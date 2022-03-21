import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = ChatState();

	return (
		<div
			className={
				'bg-white flex-col w-full max-w-full overflow-hidden md:2/3 rounded-lg py-3 px-2 md:flex ' +
				(selectedChat ? 'flex' : 'hidden')
			}
		>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</div>
	);
};

export default ChatBox;
