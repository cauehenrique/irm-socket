import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

interface Message {
	hour: string;
	author: string;
	authorColor: string;
	message: string;
}

app.get("/", (request, response) => {
	response.json({ message: "Hello World" });
	return response.status(200).send();
});

io.on("connection", (socket) => {
	const localeHour = new Date().toLocaleTimeString("pt-BR").split(":");
	const hour = `${localeHour[0]}:${localeHour[1]}`;

	const newUserMessage: Message = {
		hour,
		author: "system",
		authorColor: "#000000",
		message: `${socket.id} connected`,
	};

	io.emit("new-user", newUserMessage);

	socket.on("new-message", (message: Message) => {
		io.emit("new-message", message);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(1337, () => {
	console.log("Server started on port 1337");
});
