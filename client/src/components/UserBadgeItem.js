import { XIcon } from '@heroicons/react/outline';

const UserBadgeItem = ({ user, handleFunction }) => {
	return (
		<div
			className="flex items-center mr-1 bg-cyan-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-1"
			onClick={handleFunction}
		>
			{user.name}
			<XIcon className="w-4 h-4 ml-1 cursor-pointer" />
		</div>
	);
};

export default UserBadgeItem;
