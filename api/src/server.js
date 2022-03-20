import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 8000;

connectDB();
const app = express();
const server = http.createServer(app);

// Set up cors
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

app.use(express.json()); // to accept json data

// routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

// error messages
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
	res.send('running');
});

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: process.env.CLIENT_URL,
	},
});

io.on('connection', (socket) => {
	console.log('connected to socket.io');

	socket.on('setup', (userData) => {
		socket.join(userData._id);
		socket.emit('connected');
	});

	socket.on('join chat', (room) => {
		socket.join(room);
		console.log('User joined room: ' + room);
	});

	socket.on('typing', (room) => socket.in(room).emit('typing'));
	socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

	socket.on('new message', (newMessageRecieved) => {
		let chat = newMessageRecieved.chat;

		if (!chat.users) return console.log('chat.users not defined');

		chat.users.forEach((user) => {
			// don't send to ourself
			if (user._id == newMessageRecieved.sender._id) return;

			socket.in(user._id).emit('message recieved', newMessageRecieved);
		});
	});

	socket.off('setup', () => {
		console.log('User disconnected');
		socket.leave(userData._id);
	});
});

server.listen(PORT, console.log(`Listening on PORT ${PORT}...`));
