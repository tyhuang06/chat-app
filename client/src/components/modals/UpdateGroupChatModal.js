import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	IconButton,
	useToast,
	FormControl,
	Input,
	Spinner,
} from '@chakra-ui/react';
import { PencilAltIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import axiosDefault from '../../axios';
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../UserBadgeItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { user, selectedChat, setSelectedChat } = ChatState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

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
			console.log(data);
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
		}
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.put(
				'/chat/group/rename',
				{
					chatId: selectedChat._id,
					chatName: groupChatName,
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occurred',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setRenameLoading(false);
		}

		setGroupChatName('');
	};

	const handleAddUser = async (userToAdd) => {
		if (selectedChat.users.includes(userToAdd)) {
			toast({
				title: 'User already in Group!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: 'Only admin can add user!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
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

			const { data } = await axiosDefault.put(
				'/chat/group/add',
				{
					chatId: selectedChat._id,
					userId: userToAdd._id,
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occurred',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
	};

	const handleRemove = async (removeUser) => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			removeUser._id !== user._id
		) {
			toast({
				title: 'Only admin can remove user!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
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

			const { data } = await axiosDefault.put(
				'/chat/group/remove',
				{
					chatId: selectedChat._id,
					userId: removeUser._id,
				},
				config
			);

			removeUser._id === user._id
				? setSelectedChat()
				: setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occurred',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				icon={<PencilAltIcon className="w-5 h-5" />}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="28px"
						className="flex justify-center"
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl className="flex">
							<Input
								placeholder="Chat Name"
								className="mb-3"
								value={groupChatName}
								onChange={(e) =>
									setGroupChatName(e.target.value)
								}
							/>
							<Button
								colorScheme="teal"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users"
								className="mb-3"
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						<div className="mb-2 flex flex-wrap w-full">
							{selectedChat.users.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</div>

						{loading ? (
							<Spinner className="flex" />
						) : (
							searchResult
								?.slice(0, 4)
								.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() =>
											handleAddUser(user)
										}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme="red"
							ml={3}
							onClick={() => handleRemove(user)}
						>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
