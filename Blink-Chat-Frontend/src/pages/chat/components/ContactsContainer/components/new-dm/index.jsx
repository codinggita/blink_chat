import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import Lottie from "react-lottie"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefalutOptions, getColor } from "@/lib/utils"
import apiClient from "@/lib/api-client"
import { CONTACTS, HOST } from "@/utils/constants"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { useContact } from "@/store/slices/chat-slice.js"


function NewDm() {

    const [openNewContactModel, setopenNewContactModel] = useState(false)
    const [searchedContacts, setsearchedContacts] = useState([])
    const [firstName, setfirstName] = useState("")

    const { contact, selectContact } = useContact()

    const searchContacts = async () => {
        if (!firstName) {
            setsearchedContacts([])
        }

        try {
            const response = await apiClient.post(CONTACTS, { firstName })
            const data = response.data.contacts
            if (response.status === 200 && response.data.contacts) {
                setsearchedContacts(data)
            }
            else {
                setsearchedContacts([])
            }

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Finding Users Faild.');

        }
    }
    useEffect(() => {
        if (openNewContactModel) {
            searchContacts();
        }
    }, [openNewContactModel, firstName]);

    const selectNewContact = (contact) => {
        setopenNewContactModel(false);
        selectContact(contact)
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300 cursor-pointer"
                            onClick={() => setopenNewContactModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Add New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModel} onOpenChange={setopenNewContactModel}>
                <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please Select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" className=" rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => setfirstName(e.target.value)} />
                    </div>
                    < ScrollArea className='h-[275px]'>
                        <div>

                            {
                                searchedContacts.map((item) => (
                                    <div key={item.id} className=" flex gap-5 cursor-pointer hover:bg-[#30313b] p-2 transition-all duration-300 rounded-lg" onClick={() => selectNewContact(item)}>
                                        <div className="w-11 h-11 relative">
                                            <Avatar className='h-11 w-11 rounded-full overflow-hidden'>
                                                {item.image ? (
                                                    <AvatarImage
                                                        src={item.image}
                                                        alt="Profile"
                                                        className="object-cover w-full h-full bg-black rounded-full"
                                                    />
                                                ) : (
                                                    <div className={`uppercase h-11 w-11 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(item.color)}`}>
                                                        {item.firstName
                                                            ? item.firstName.split("").shift()
                                                            : item.email.split("").shift()
                                                        }
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className=" flex flex-col">
                                            <div className=" flex items-center gap-1.5">
                                                <span>{item.firstName}</span>
                                                <span>{item.lastName}</span>
                                            </div>
                                            <span className=" text-xs">{item.email}</span>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </ScrollArea>
                    {
                        searchedContacts.length <= 0 && (
                            <div>
                                <div className="flex-1 md:flex mt-5 flex-col justify-center items-center duration-1000 transition-all">
                                    <Lottie
                                        isClickToPauseDisabled={true}
                                        height={140}
                                        width={140}
                                        options={animationDefalutOptions}
                                    />
                                    <div className=" text-opacity-80 text-white flex flex-col gap-5 items-center m-5 lg:text-2 xl text-xl transition-all duration-300 text-center">
                                        <h3 className=" poppins-medium">
                                            Hi<span className="text-purple-500">! </span>
                                            Search new <span className="text-purple-500">Contacts</span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDm