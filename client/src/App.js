import React, { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import Logo from "./Logo.png";

const socket = io.connect("http://localhost:3001");

function App() {
	const [username, setUsername] = useState("");
	const [showChat, setShowChat] = useState(false);

	const joinRoom = () => {
		if (username !== "") {
			socket.emit("join_room");
			setShowChat(true);
		}
	};
	const leaveRoom = () => {
		setShowChat(false);
	};
	return (
		<div className="App">
			{!showChat ? (
				<div className="joinChatContainer">
					<h3>
						<img src={Logo} className="App-logo" alt="logo" />
					</h3>
					<input
						type="text"
						placeholder="Your username..."
						onChange={(event) => {
							setUsername(event.target.value);
						}}
					/>

					<button onClick={joinRoom}>Join chat</button>
				</div>
			) : (
				<Chat
					socket={socket}
					username={username}
					onLeaveRoom={leaveRoom}
				/>
			)}
		</div>
	);
}

export default App;
