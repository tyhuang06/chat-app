import express from 'express';
import { chats } from './data.js';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;

const app = express();

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
