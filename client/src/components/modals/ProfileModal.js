import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	IconButton,
	Button,
	Image,
	Text,
} from '@chakra-ui/react';
import { EyeIcon } from '@heroicons/react/solid';

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<div>
			{children ? (
				<div onClick={onOpen}>{children}</div>
			) : (
				<IconButton
					className="flex"
					icon={<EyeIcon className="w-5 h-5" />}
					onClick={onOpen}
				/>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent h="400px">
					<ModalHeader
						className="flex justify-center"
						fontSize="28px"
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody className="flex flex-col items-center justify-center">
						<Image
							boxSize="150px"
							src={user.pic}
							alt={user.name}
							className="rounded-full"
						/>
						<Text className="mt-4">Email: {user.email}</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default ProfileModal;
