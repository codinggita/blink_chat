import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/ChatContainer';
import ContactsContainer from './components/ContactsContainer';
import EmptyChatContainer from './components/EmptyChatContainer';

function Chat() {

    const { userInfo } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {

        if (!userInfo) {
            // If userInfo is not defined, redirect to the login or another appropriate page
            toast("User is not logged in. Redirecting...");
            navigate('/auth');
            return;
        }

        // If profile-setup is not completed, redirect to the profile setup page
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue.")
            navigate('/profile')
        }
    }, [userInfo, navigate])

    return (
        <div className='flex h-[100vh] text-white overflow-hidden'>
            {/* <ContactsContainer /> */}
            {/* <ChatContainer/> */}
            <EmptyChatContainer/>
        </div>
    )
}

export default Chat