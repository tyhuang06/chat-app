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

const Signup = () => {
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirmpassword, setConfirmpassword] = useState();
	const [pic, setPic] = useState();

	const navigate = useNavigate();
	const toast = useToast();

	const handleClick = () => setShow(!show);

	const postDetails = (pics) => {
		setLoading(true);
		if (pics === undefined) {
			toast({
				title: 'Please select an image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		if (
			pics.type === 'image/jpeg' ||
			pics.type === 'image/jpg' ||
			pics.type === 'image/png'
		) {
			const data = new FormData();
			data.append('file', pics);
			data.append('upload_preset', 'chat_app');
			data.append('cloud_name', 'djv34uw7a');
			fetch('https://api.cloudinary.com/v1_1//djv34uw7a/image/upload', {
				method: 'post',
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			toast({
				title: 'Please select an image (jpg/jpeg/png)!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
	};

	const submitHandler = async () => {
		setLoading(true);

		if (!name || !email || !password || !confirmpassword) {
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

		if (password !== confirmpassword) {
			toast({
				title: 'Passwords do not match',
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
				'/user',
				{ name, email, password, pic },
				config
			);

			toast({
				title: 'Registration success!',
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

			<FormControl id="pic" className="mb-2">
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
				isLoading={loading}
			>
				Sign Up
			</Button>
		</div>
	);
};

export default Signup;
