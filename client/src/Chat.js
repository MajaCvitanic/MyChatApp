import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Logo from "./Logo.png";

function Chat({ socket, username, onLeaveRoom }) {
	const [currentMessage, setCurrentMessage] = useState("");
	const [messageList, setmessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};
			await socket.emit("send_message", messageData);
			setmessageList((list) => [...list, messageData]);
			setCurrentMessage("");
		}
	};

	useEffect(() => {
		socket.on("recive_message", (data) => {
			setmessageList((list) => [...list, data]);
		});
	}, [socket]);
	const handleLeaveRoom = () => {
		socket.emit("leave_room");
		onLeaveRoom();
	};
	return (
		<div className="chat-window">
			<div className="chat-header">
				<div className="logospace">
					<img
						src={Logo}
						className="App-logo"
						alt="logo"
						style={{ height: 40 }}
					/>
				</div>
				<div className="userConnection">
					<p> User: {username}</p>
					<button className="leaveroomBtn" onClick={handleLeaveRoom}>
						Logout
					</button>
				</div>
			</div>
			<div className="chat-body">
				<ScrollToBottom className="message-container">
					{messageList.map((messageContent) => {
						return (
							<div
								className="message"
								id={
									username === messageContent.author
										? "you"
										: "other"
								}
							>
								<div>
									<div className="message-content">
										<p>{messageContent.message}</p>
									</div>
									<div className="message-meta">
										<p id="time">{messageContent.time}</p>
										<p id="author">
											{messageContent.author}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</ScrollToBottom>
			</div>
			<div className="chat-footer">
				<input
					type="text"
					value={currentMessage}
					placeholder="Start typing..."
					onChange={(event) => {
						setCurrentMessage(event.target.value);
					}}
					onKeyDown={(event) => {
						event.key === "Enter" && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>send</button>
			</div>
		</div>
	);
}

export default Chat;
