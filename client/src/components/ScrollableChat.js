import { Avatar, Tooltip } from '@chakra-ui/react';
import ScollableFeed from 'react-scrollable-feed';
import moment from 'moment';
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
	isNewDay,
} from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
	const { user } = ChatState();

	return (
		<ScollableFeed>
			{messages &&
				messages.map((m, i) => (
					<>
						{isNewDay(messages, m, i) && (
							<div className="flex justify-center mx-auto bg-slate-200 w-fit px-2 rounded-md">
								{moment(m.createdAt).format('ll')}
							</div>
						)}
						<div key={m._id} className="flex items-center">
							{(isSameSender(messages, m, i, user._id) ||
								isLastMessage(messages, i, user._id)) && (
								<Tooltip
									label={m.sender.name}
									placement="bottom-start"
									hasArrow
								>
									<Avatar
										size="sm"
										className="cursor-pointer mr-1"
										name={m.sender.name}
										src={m.sender.pic}
									/>
								</Tooltip>
							)}
							<div
								className={
									'flex items-end ' +
									(m.sender._id === user._id
										? 'flex-row-reverse'
										: '')
								}
								style={{
									maxWidth: '75%',
									marginLeft: isSameSenderMargin(
										messages,
										m,
										i,
										user._id
									),
									marginTop: isSameUser(
										messages,
										m,
										i,
										user._id
									)
										? 3
										: 10,
								}}
							>
								<div
									className={
										'flex rounded-full py-1 px-3 ' +
										(m.sender._id === user._id
											? 'bg-sky-300'
											: 'bg-teal-300')
									}
								>
									{m.content}
								</div>
								<div className="text-xs m-1 ">
									{moment(m.createdAt).format('LT')}
								</div>
							</div>
						</div>
					</>
				))}
		</ScollableFeed>
	);
};

export default ScrollableChat;
