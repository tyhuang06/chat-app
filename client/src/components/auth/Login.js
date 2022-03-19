import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
} from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosDefault from '../../axios';

const Login = () => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const toast = useToast();

	const handleClick = () => setShow(!show);

	const submitHandler = async () => {
		setLoading(true);

		if (!email || !password) {
			toast({
				title: 'Please fill in all the fields',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};

			const { data } = await axiosDefault.post(
				'/user/login',
				{ email, password },
				config
			);

			toast({
				title: 'Login success!',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});

			localStorage.setItem('userInfo', JSON.stringify(data));
			setLoading(false);
			navigate('/chats');
		} catch (error) {
			toast({
				title: 'Error!',
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
		<div className="p-2">
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
			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Login
			</Button>
		</div>
	);
};

export default Login;
