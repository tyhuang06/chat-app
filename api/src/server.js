import express from 'express';
import cors from 'cors';
import { chats } from './data.js';
import 'dotenv/config';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8000;

connectDB();
const app = express();

// Set up cors
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

// routes
app.get('/', (req, res) => {
	res.send('running');
});

app.get('/chat', (req, res) => {
	res.send(chats);
});

app.get('/chat/:id', (req, res) => {
	const singleChat = chats.find((c) => c._id === req.params.id);
	res.send(singleChat);
});

app.listen(PORT, console.log(`Listening on PORT ${PORT}...`));
