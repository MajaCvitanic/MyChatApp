const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`User with ID: ${socket.id} joined room: ${data}`);
	});

	socket.on("send_message", (data) => {
		socket.to(data.room).emit("recive_message", data);
	});
	socket.on("leave_room", (data) => {
		const room = Object.keys(socket.data);
		room.forEach((data) => {
			if (data !== socket.id) {
				socket.leave(data);
				console.log(`User with ID: ${socket.id} left room: ${data}`);
			}
		});
	});
	socket.on("disconnect", () => {
		console.log("User Disconnected", socket.id);
	});
});

server.listen(3001, () => {
	console.log("SERVER RUNNING");
});
