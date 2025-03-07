import MessageBar from "./components/message-bar"
import ChatHeader from "./components/chat-header"
import MessageContainer from "./components/message-container"
import { SocketProvider } from "@/context/SocketContext"

function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <SocketProvider>
      <MessageBar />
      </SocketProvider>
    </div>
  )
}

export default ChatContainer;