import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"
import { createAuthSlice } from "@/store/slices/auth-slice";
import { useSocket } from "@/context/SocketContext";
import { useContact } from "@/store/slices/chat-slice";
import { useAppStore } from "@/store";

function MessageBar() {

  const emojiRef = useRef();
  const [emojiPickerOpen, setemojiPickerOpen] = useState(false)
  const [message, setmessage] = useState("")
  const { selectedChatType } = createAuthSlice();
  const { contact } = useContact();
  const socket = useSocket();
  const { userInfo } = useAppStore();


  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setemojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef])

  const handleAddEmoij = (emoji) => {
    setmessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
 
    if (!socket || typeof socket.emit !== "function") {
      console.error("Socket is not initialized properly!");
      return;
    }

    const send_it = {
      sender: userInfo.id,
      content: message,
      recipient: contact._id,
      messageType: "text",
      fileUrl: undefined,
    };

    socket.emit("sendMessage", send_it, (ack) => {
      console.log("✅ Server acknowledged message:", ack);
    });
    setmessage("");
  };


  return (
    <div className="h-[8vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center justify-between gap-5 pr-5">
        <input
          type="text"
          className="flex p-4 bg-transparent rounded-md focus:border-none focus:outline-none w-full"
          placeholder="Enter Message"
          value={message}
          onChange={e => setmessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevents unintended behavior (e.g., form submission)
              handleSendMessage();
            }
          }}
        />

        <div className=" flex gap-5 items-center justify-center">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-500 transition-all">
            <GrAttachment className="text-xl" />
          </button>
          <div className=" relative">
            <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-500 transition-all" onClick={() => setemojiPickerOpen(true)}>
              <RiEmojiStickerLine className="text-xl" />
            </button>
            <div className=" absolute bottom-16 right-16" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoij}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>
      </div>
      <button className="bg-[#8417ff] flex items-center justify-center p-4 rounded-md focus:border-none focus:outline-none focus:text-white hover:bg-[#741bda] focus:bg-[#741bda] duration-500 transition-all" onClick={handleSendMessage}>
        <IoSend className="text-xl" />
      </button>
    </div>
  )
}

export default MessageBar;