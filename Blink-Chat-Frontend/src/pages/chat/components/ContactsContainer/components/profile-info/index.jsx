import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import apiClient from "@/lib/api-client";

function ProfileInfo() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async () =>{
        try{
            const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})

            if(response.status === 200){
                navigate('/auth')
                setUserInfo(null)
            }
        }catch(err){
            console.error(err)
        }
    }

    return (
        <div className=" absolute bottom-0 h-12 flex justify-between items-center w-full px-5 bg-[#2a2b33]">
            <div className="flex items-center justify-start gap-3 w-full">
                <div className="w-9 h-9 relative">
                    <Avatar className='h-9 w-9 rounded-full overflow-hidden'>
                        {userInfo.image ? (
                            <AvatarImage
                                src={userInfo.image}
                                alt="Profile"
                                className="object-cover w-full h-full bg-black"
                            />
                        ) : (
                            <div className={`uppercase h-9 w-9 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0)
                                    : userInfo.email.charAt(0)
                                }
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className=" flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium" onClick={()=>navigate('/profile')}/> 
                        </TooltipTrigger>
                        <TooltipContent className="border-none bg-[#1c1b1e] text-white">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl font-medium" onClick={logOut}/> 
                        </TooltipTrigger>
                        <TooltipContent className="border-none bg-[#1c1b1e] text-white">
                            Log Out
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo