import {
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from '@chakra-ui/react';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import axiosDefault from '../axios';
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './modals/ProfileModal';
import UpdateGroupChatModal from './modals/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../assets/typing.json';

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, setSelectedChat } = ChatState();

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState();
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const toast = useToast();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	useEffect(() => {
		socket = io(process.env.REACT_APP_API_URL);
		socket.emit('setup', user);
		socket.on('connected', () => setSocketConnected(true));
		socket.on('typing', () => setIsTyping(true));
		socket.on('stop typing', () => setIsTyping(false));

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;

		// eslint-disable-next-line
	}, [selectedChat]);

	useEffect(() => {
		socket.on('message recieved', (newMessageRecieved) => {
			if (
				!selectedChatCompare || // if chat is not selected or doesn't match current chat
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				// give notification
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.get(
				`/message/${selectedChat._id}`,
				config
			);

			setMessages(data);
			setLoading(false);

			socket.emit('join chat', selectedChat._id);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to load messages',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	const sendMessage = async (event) => {
		if (event.key === 'Enter' && newMessage) {
			socket.emit('stop typing', selectedChat._id);

			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user.token}`,
					},
				};

				setNewMessage('');

				const { data } = await axiosDefault.post(
					'/message',
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				socket.emit('new message', data);

				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: 'Error Occured!',
					description: 'Failed to send message',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'bottom-left',
				});
			}
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit('typing', selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;
		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit('stop typing', selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};

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
									fetchMessages={fetchMessages}
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
					<div className="overflow-y-hidden flex flex-col w-full h-full mt-3 py-2 px-4 bg-slate-100 justify-end rounded-lg">
						{loading ? (
							<Spinner
								size="xl"
								className="flex self-center m-auto"
							/>
						) : (
							<div className="flex flex-col overflow-y-auto">
								<ScrollableChat messages={messages} />
							</div>
						)}

						<FormControl
							onKeyDown={sendMessage}
							className="mt-2 rounded-lg"
						>
							{isTyping ? (
								<div className="flex items-end">
									<Lottie
										options={defaultOptions}
										width={70}
										style={{
											marginLeft: 0,
											marginBottom: 10,
										}}
									/>
								</div>
							) : (
								<></>
							)}
							<Input
								placeholder="Enter a message"
								variant="filled"
								value={newMessage}
								onChange={typingHandler}
							/>
						</FormControl>
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
