import axios from 'axios';

const axiosDefault = axios.create({
	baseURL:
		process.env.REACT_APP_API_URL ||
		'https://mern-chatapp-deploy.herokuapp.com/',
	withCredentials: true,
});

export default axiosDefault;
