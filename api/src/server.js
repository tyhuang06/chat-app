import express from 'express';
import cors from 'cors';
import { chats } from './data.js';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

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

app.use(express.json()); // to accept json data

// routes
app.use('/user', userRoutes);

// error messages
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
	res.send('running');
});

app.listen(PORT, console.log(`Listening on PORT ${PORT}...`));
