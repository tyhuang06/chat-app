import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatProvider from './context/ChatProvider';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
	return (
		<ChatProvider>
			<div className="app">
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/chats" element={<ChatPage />}></Route>
				</Routes>
			</div>
		</ChatProvider>
	);
}

export default App;
