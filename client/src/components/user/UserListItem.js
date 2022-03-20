import { Avatar, Text } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../../context/ChatProvider';

const UserListItem = ({ user, handleFunction }) => {
	return (
		<div
			className="flex w-full bg-gray-100 mb-2 px-3 py-2 rounded-lg cursor-pointer items-center hover:bg-teal-500 hover:text-white"
			onClick={handleFunction}
		>
			<Avatar size="sm" name={user.name} src={user.pic} />
			<div className="ml-2">
				<Text>{user.name}</Text>
				<Text className="text-xs">Email: {user.email}</Text>
			</div>
		</div>
	);
};

export default UserListItem;
