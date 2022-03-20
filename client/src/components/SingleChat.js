import { IconButton, Text } from '@chakra-ui/react';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './modals/ProfileModal';
import UpdateGroupChatModal from './modals/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, setSelectedChat } = ChatState();

	return (
		<>
			{selectedChat ? (
				<div className="flex flex-col h-full w-full">
					<div className="flex w-full px-2 justify-between items-center">
						<IconButton
							icon={<ArrowSmLeftIcon />}
							d={{ base: 'flex', md: 'none' }}
							className="w-2 h-2"
							onClick={() => setSelectedChat('')}
						/>
						{selectedChat.isGroupChat ? (
							<>
								<Text className="text-2xl">
									{selectedChat.chatName.toUpperCase()}
								</Text>

								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
								></UpdateGroupChatModal>
							</>
						) : (
							<>
								<Text className="text-2xl">
									{getSender(user, selectedChat.users)}
								</Text>
								<ProfileModal
									user={getSenderFull(
										user,
										selectedChat.users
									)}
								></ProfileModal>
							</>
						)}
					</div>
					<div className="flex flex-col w-full h-full mt-3 py-2 px-4 bg-slate-100 justify-end rounded-lg">
						content
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center h-full">
					<Text className="text-2xl">
						Click on a chat to start chatting
					</Text>
				</div>
			)}
		</>
	);
};

export default SingleChat;
