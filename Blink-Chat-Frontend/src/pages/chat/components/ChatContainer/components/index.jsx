import { RiCloseFill } from 'react-icons/ri'
import { useContact } from '@/store/slices/chat-slice.js'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';

function ChatHeader() {

  const { contact, clearContact } = useContact();

  const closeChat = () => {
    clearContact();
  }

  return (
    <div className="h-[8vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
      <div className="flex g-5 items-center">

        <div className="flex g-3 items-center justify-center"></div>
        <div className="flex items-center justify-center g-5 ">

          <div className='flex items-center gap-3.5'>
            <div>
              <Avatar className='h-10 w-10 rounded-full overflow-hidden'>
                {contact.image ? (
                  <AvatarImage
                    src={contact.image}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()
                    }
                  </div>
                )}
              </Avatar>
            </div>
            <div className='flex gap-1.5'>
              <span>{contact.firstName}</span>
              <span>{contact.lastName}</span>
            </div>
          </div>
        </div>
      </div>
      <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-500 transition-all'>
        <RiCloseFill className='text-2xl' onClick={closeChat} />
      </button>
    </div>
  )
}
export default ChatHeader
