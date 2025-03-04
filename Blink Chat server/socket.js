import { Server } from "socket.io";
import Message from "./Models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const userSocketMap = new Map(); // Maps userId -> socketId

    // Function to handle user disconnecting
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`Removed user ${userId} from socket map.`);
                break;
            }
        }
    };

    // Function to send a message
    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            // Save message to database
            const createdMessage = await Message.create(message);

            // Populate sender and recipient details
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color");

            console.log("Message saved & populated:", messageData);

            // Ensure we emit the correctly spelled event name "receiveMessage"
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
                console.log(`Message sent to recipient ${message.recipient}`);
            }

            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
                console.log(`Message sent to sender ${message.sender}`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
        } else {
            console.warn("User ID not provided during connection.");
        }

        // Listen for 'sendMessage' event
        socket.on("sendMessage", async (message) => {
            console.log("Received sendMessage event:", message);
            await sendMessage(message);
        });

        // Handle disconnection
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
