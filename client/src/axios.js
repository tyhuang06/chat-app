import axios from 'axios';

const axiosDefault = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
	withCredentials: true,
});

export default axiosDefault;
