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
	useToast,
	FormControl,
	Input,
	Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import axiosDefault from '../../axios';
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../UserBadgeItem';

const GroupChatModal = ({ children }) => {
	const { user, chats, setChats } = ChatState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

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

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: 'User already in Group!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleDelete = (delUser) => {
		setSelectedUsers(
			selectedUsers.filter((sel) => sel._id !== delUser._id)
		);
	};
	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: 'Please fill all the fields!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axiosDefault.post(
				'/chat/group',
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
				},
				config
			);

			setChats([data, ...chats]);
			onClose();

			toast({
				title: 'New Group Chat Created!',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
		} catch (error) {
			toast({
				title: 'Failed to create the chat!',
				description: error.response.data,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};

	return (
		<>
			<div onClick={onOpen}>{children}</div>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="28px"
						className="flex justify-center"
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody className="flex flex-col items-center">
						<FormControl>
							<Input
								placeholder="Chat Name"
								className="mb-3"
								onChange={(e) =>
									setGroupChatName(e.target.value)
								}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users"
								className="mb-3"
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						<div className="mb-2 flex flex-wrap w-full">
							{selectedUsers.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleDelete(u)}
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
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
