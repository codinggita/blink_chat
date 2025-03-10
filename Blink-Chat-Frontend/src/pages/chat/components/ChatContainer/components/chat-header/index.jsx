import { RiCloseFill, RiDeleteBinLine, RiUserLine, RiMailLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useContact } from '@/store/slices/chat-slice.js';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useChatStore } from '@/store/slices/chat-slice.js';
import { useAppStore } from '@/store';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import apiClient from '@/lib/api-client';
import { DELETEMESSAGES } from '@/utils/constants';
import { toast } from 'sonner';

function ChatHeader() {
  const { contact, clearContact } = useContact();
  const { selectedChatMessages, setSelectedChatMessages } = useChatStore();
  const { userInfo } = useAppStore();
  const [totalMessages, setTotalMessages] = useState(0);

  const closeChat = () => {
    clearContact();
  };

  useEffect(() => {
    setTotalMessages(selectedChatMessages.length);
  }, [selectedChatMessages]);

  const deleteMessages = async () => {
    try {
      const response = await apiClient.delete(DELETEMESSAGES, {
        data: {
          sender: userInfo.id,
          recipient: contact._id,
        },
      });
      console.log('Delete response:', response);
      if (response.status === 201) {
        toast.message('Messages deleted successfully');
      }
      setSelectedChatMessages([]);
    } catch (error) {
      console.error('Error happened:', error);
    }
  };

  return (
    <div className="h-[8vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <Drawer>
        <DrawerTrigger>
          <div className="flex items-center gap-3.5 cursor-pointer">
            <div>
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={contact.image}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.split('').shift()
                      : contact.email.split('').shift()}
                  </div>
                )}
              </Avatar>
            </div>
            <div className="flex gap-1.5">
              <span>{contact.firstName}</span>
              <span>{contact.lastName}</span>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="bg-[#1c1d25] border-black">
          <DrawerHeader>
            <div className="flex flex-col items-center gap-6">
              <div>
                <DrawerTitle className="text-white text-4xl">Profile Info</DrawerTitle>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-40 w-40 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={contact.image}
                      alt="Profile"
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-40 w-40 text-7xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                        contact.color
                      )}`}
                    >
                      {contact.firstName
                        ? contact.firstName.split('').shift()
                        : contact.email.split('').shift()}
                    </div>
                  )}
                </Avatar>
                <div className="text-white text-2xl font-semibold">
                  {contact.firstName} {contact.lastName}
                </div>
              </div>
              <div className="w-full max-w-md">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <RiMailLine className="text-white text-xl" />
                    <span className="text-white text-lg">Email: {contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiUserLine className="text-white text-xl" />
                    <span className="text-white text-lg">First Name: {contact.firstName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiUserLine className="text-white text-xl" />
                    <span className="text-white text-lg">Last Name: {contact.lastName}</span>
                  </div>
                </div>
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter className="flex flex-col items-center gap-4">
            <div className="text-white text-lg">
              Total Messages: {totalMessages}
            </div>
            <button
              onClick={deleteMessages}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RiDeleteBinLine className="text-xl" />
              Clear Chat
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <button
        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-500 transition-all"
        onClick={closeChat}
      >
        <RiCloseFill className="text-2xl" />
      </button>
    </div>
  );
}

export default ChatHeader;