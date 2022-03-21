import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Button,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
	useDisclosure,
	Input,
	useToast,
	Spinner,
} from '@chakra-ui/react';
import {
	BellIcon,
	ChevronDownIcon,
	LogoutIcon,
	SearchIcon,
} from '@heroicons/react/outline';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './modals/ProfileModal';
import { useNavigate } from 'react-router-dom';
import axiosDefault from '../axios';
import ChatLoading from './ChatLoading';
import UserListItem from './user/UserListItem';
import { getSender, getSenderFull } from '../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		notification,
		setNotification,
	} = ChatState();

	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();

	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		navigate('/');
	};

	const handleSearch = async (query) => {
		setSearch(query);

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.get(
				`/user?search=${search}`,
				config
			);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to load the search results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoading(false);
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);

			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.post(
				'/chat',
				{ userId },
				config
			);

			if (!chats.find((c) => c._id === data._id)) {
				setChats([data, ...chats]);
			}

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	useEffect(() => {
		handleSearch();

		// eslint-disable-next-line
	}, []);

	return (
		<div className="flex justify-between items-center bg-white w-full px-2 py-1 border-4">
			<Tooltip
				label="Search users to chat"
				hasArrow
				placement="bottom-end"
			>
				<Button variant="ghost" onClick={onOpen}>
					<SearchIcon className="w-5 h-5" />
					<Text className="ml-4 hidden md:flex">Search Users</Text>
				</Button>
			</Tooltip>
			<Text className="text-2xl">Chat App</Text>
			<div className="flex">
				<Menu>
					<MenuButton className="mr-4">
						<NotificationBadge
							count={notification.length}
							effect={Effect.SCALE}
						/>
						<BellIcon className="w-5 h-5 m-2" />
					</MenuButton>
					<MenuList>
						{!notification.length && (
							<div className="px-2">No New Messages</div>
						)}
						{notification.map((notif) => (
							<MenuItem
								key={notif._id}
								className="px-2"
								onClick={() => {
									setSelectedChat(notif.chat);
									setNotification(
										notification.filter((n) => n !== notif)
									);
								}}
							>
								<div className="flex items-center">
									<Avatar
										size="sm"
										className="cursor-pointer"
										name={notif.chat.chatName}
										src={
											notif.chat.isGroupChat
												? {}
												: getSenderFull(
														user,
														notif.chat.users
												  ).pic
										}
									/>
									<div className="flex flex-col ml-2 leading-tight">
										<div className="font-bold">
											{notif.chat.isGroupChat
												? notif.chat.chatName
												: getSender(
														user,
														notif.chat.users
												  )}
										</div>
										<div>New Message</div>
									</div>
								</div>
								{/* {notif.chat.isGroupChat ? (
									<div>
										<Avatar
											size="sm"
											className="cursor-pointer"
											name={notif.chat.chatName}
										/>
										New Message in ${notif.chat.chatName}
									</div>
								) : (
									<div>
										New Message from $
										{getSender(user, notif.chat.users)}
									</div>
								)} */}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon className="w-5 h-5" />}
					>
						<Avatar
							size="sm"
							className="cursor-pointer"
							name={user.name}
							src={user.pic}
						/>
					</MenuButton>
					<MenuList>
						<ProfileModal user={user}>
							<MenuItem>My Profile</MenuItem>
						</ProfileModal>
						<MenuDivider />
						<MenuItem onClick={logoutHandler}>
							<LogoutIcon className="w-5 h-5 mr-2" /> Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</div>

			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Search Users</DrawerHeader>

					<DrawerBody>
						<div className="flex mb-2">
							<Input
								placeholder="Search by name or email"
								onChange={(e) => handleSearch(e.target.value)}
							/>
							{/* 							<Button onClick={handleSearch} className="ml-2">
								Go
							</Button> */}
						</div>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner className="flex" />}
					</DrawerBody>

					<DrawerFooter></DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default SideDrawer;
