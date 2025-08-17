// socket/index.js
import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
	io = new Server(server, {
		cors: { origin: "*", methods: ["GET", "POST"] },
	});

	io.on("connection", (socket) => {
		console.log("🔌 New client connected:", socket.id);

		// Join personal room by publicKey (client should emit 'join')
		socket.on("join", (publicKey) => {
			socket.join(publicKey);
			console.log(`${publicKey} joined room`);
		});

		// Send + Receive messages
		socket.on("send_message", (data) => {
			// data = { receiver, text, sender }
			io.to(data.receiver).emit("receive_message", data);
		});

		socket.on("disconnect", () => {
			console.log("❌ Client disconnected:", socket.id);
		});
	});
};

export const getIO = () => {
	if (!io) throw new Error("Socket.io not initialized!");
	return io;
};
