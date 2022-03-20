import React, { useState } from 'react';
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
	ChevronDownIcon,
	LogoutIcon,
	SearchIcon,
} from '@heroicons/react/outline';
import { BellIcon } from '@heroicons/react/solid';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axiosDefault from '../axios';
import ChatLoading from './ChatLoading';
import UserListItem from './user/UserListItem';

const SideDrawer = () => {
	const { user, setSelectedChat, chats, setChats } = ChatState();

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

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: 'Please enter something in search',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top-left',
			});
			return;
		}

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
					<MenuButton>
						<BellIcon className="w-5 h-5" />
					</MenuButton>
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
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch} className="ml-2">
								Go
							</Button>
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
