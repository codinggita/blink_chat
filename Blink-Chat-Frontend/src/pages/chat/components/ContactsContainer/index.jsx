import React from 'react'
import logo from '@/assets/logo.svg'

function ContactsContainer() {
    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="ml-2">
                <img src={logo} alt="" />
            </div>
        </div>
    )
}

export default ContactsContainer