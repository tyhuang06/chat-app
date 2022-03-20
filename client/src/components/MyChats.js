import { Button, Stack, Text, useToast } from '@chakra-ui/react';
import { PlusIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import axiosDefault from '../axios';
import { getSender } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './modals/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
	const { user, selectedChat, setSelectedChat, chats, setChats } =
		ChatState();

	const [loggedUser, setLoggedUser] = useState();

	const toast = useToast();

	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.get('/chat', config);
			setChats(data);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to load the chats',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
		fetchChats();
	}, [fetchAgain]);

	return (
		<div
			className={
				'bg-white flex-col w-full md:w-1/3 rounded-lg py-3 md:flex md:mr-4 ' +
				(selectedChat ? 'hidden' : 'flex mr-3')
			}
		>
			<div className="flex w-full items-center justify-between text-2xl px-5 mb-2">
				My Chats
				<GroupChatModal>
					<Button
						d="flex"
						rightIcon={<PlusIcon className="w-4 h-4" />}
					>
						New Group
					</Button>
				</GroupChatModal>
			</div>
			<div className="flex flex-col bg-slate-100 rounded-lg p-3 mx-2 overflow-hidden">
				{chats ? (
					<Stack overflowY="auto">
						{chats.map((chat) => (
							<div
								key={chat._id}
								className={
									'flex px-3 py-2 rounded-lg cursor-pointer hover:bg-teal-400 ' +
									(selectedChat === chat
										? 'bg-teal-500 text-white'
										: 'bg-slate-200 text-black')
								}
								onClick={() => setSelectedChat(chat)}
							>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
							</div>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</div>
		</div>
	);
};

export default MyChats;
