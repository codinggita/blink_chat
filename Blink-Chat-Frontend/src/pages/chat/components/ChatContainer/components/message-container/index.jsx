import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/store/slices/chat-slice";
import { useContact } from "@/store/slices/chat-slice";
import { useAppStore } from "@/store";
import { MESSAGES } from "@/utils/constants";
import moment from "moment";
import apiClient from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";

function MessageContainer() {
  const { selectedChatMessages, selectedChatType, setSelectedChatMessages } = useChatStore();
  const { contact } = useContact();
  const { userInfo } = useAppStore();
  const scrollRef = useRef();

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // Render messages
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  // Render individual DM messages
  const renderDMMessages = (message) => {
    return (
      <div className={`${message.sender === contact._id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== contact._id
                ? "bg-[#8417ff]/15 text-[#8417ff]/90 border-black"
                : "border-gray-600 bg-[#2a2b33]/75 text-white/80"
              } inline-block p-4 rounded-md my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className="text-xs text-gray-600">{moment(message.timestamp).format("LT")}</div>
      </div>
    );
  };

  // Fetch messages when contact changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.post(MESSAGES, {
          sender: userInfo.id,
          recipient: contact._id,
        });
        if (response.data) {
          setSelectedChatMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (contact._id && selectedChatType === "contact") fetchMessages();
  }, [contact, setSelectedChatMessages, selectedChatType]);

  return (

      <ScrollArea className=' h-[90vh] p-7'>
        {renderMessages()}
        <div ref={scrollRef}></div>
      </ScrollArea>

  );
}

export default MessageContainer;
