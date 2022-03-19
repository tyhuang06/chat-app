import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

const Signup = () => {
	const [show, setShow] = useState(false);
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirmpassword, setConfirmpassword] = useState();
	const [pic, setPic] = useState();

	const handleClick = () => setShow(!show);

	const postDetails = () => {};
	const submitHandler = () => {};

	return (
		<div className="p-2">
			<FormControl id="first_name" isRequired className="mb-2">
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Enter Your name"
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>

			<FormControl id="email" isRequired className="mb-2">
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Enter Your Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>

			<FormControl id="password" isRequired className="mb-2">
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder="Enter Your Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement>
						<button
							className="w-full h-full flex items-center justify-center rounded-lg"
							onClick={handleClick}
						>
							{show ? (
								<EyeOffIcon className="w-5 h-5 text-gray-700" />
							) : (
								<EyeIcon className="w-5 h-5 text-gray-700" />
							)}
						</button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl id="confirm_password" isRequired className="mb-2">
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder="Confirm Password"
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement>
						<button
							className="w-full h-full flex items-center justify-center rounded-lg"
							onClick={handleClick}
						>
							{show ? (
								<EyeOffIcon className="w-5 h-5 text-gray-700" />
							) : (
								<EyeIcon className="w-5 h-5 text-gray-700" />
							)}
						</button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl id="pic" isRequired className="mb-2">
				<FormLabel>Upload profile picture</FormLabel>
				<Input
					type="file"
					accept="image/*"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>
			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
			>
				Sign Up
			</Button>
		</div>
	);
};

export default Signup;
