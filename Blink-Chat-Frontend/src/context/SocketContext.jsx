import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useContact } from "@/store/slices/chat-slice";
import { useChatStore } from "@/store/slices/chat-slice"; 

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { userInfo } = useAppStore();
    const { contact } = useContact();
    const { selectedChatType, addMessage, setSelectedChatType } = useChatStore();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userInfo && !socketRef.current) {
            console.log("🔌 Initializing socket connection...");
            setSelectedChatType("contact")
            socketRef.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socketRef.current.on("connect", () => {
                console.log("✅ Connected to server.");
                setSocket(socketRef.current);
            });

            socketRef.current.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });

            socketRef.current.on("disconnect", () => {
                console.log("❌ Disconnected from server.");
                setSocket(null);
            });

            return () => {
                if (socketRef.current) {
                    console.log("⚠️ Cleaning up socket connection...");
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        }
    }, [userInfo]);

    useEffect(() => {
        if (!socketRef.current) {
            console.warn("⚠️ No socket connection found.");
            return;
        }

        const handleReceiveMessage = (message) => {
            if (!message) {
                console.error("Received an empty message!");
                return;
            }
            if (
                selectedChatType !== undefined &&
                (contact?._id === message.sender?._id || contact?._id === message.recipient?._id)
            ) {
                console.log("Message", message)
                addMessage(message);
            }
        };

        socketRef.current.on("receiveMessage", handleReceiveMessage);

        return () => {
            if (socketRef.current) {
                console.log("🧹 Removing event listeners...");
                socketRef.current.off("receiveMessage", handleReceiveMessage);
            }
        };
    }, [selectedChatType, contact]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
