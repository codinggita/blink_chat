import { useAppStore } from '@/store'
import React,{useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {IoArrowBack} from 'react-icons/io5'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import {FaPlus, FaTrash} from 'react-icons/fa'
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';

function Profile() {

  const navigate = useNavigate()
  const {userInfo, setUserInfo} = useAppStore();
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [image, setimage] = useState(null)
  const [hoverd, sethoverd] = useState(false)
  const [selectColor, setselectColor] = useState(0)
  const fileInputRef = useRef(null)

useEffect(()=>{
  if(userInfo.profileSetup){
    setfirstName(userInfo.firstName)
    setlastName(userInfo.lastName)
    setselectColor(userInfo.color)
  }
}, [userInfo])

const validateProfile = () =>{
  if(!firstName){
    toast.error("FirstName is required")
    return false
  }
  if(!lastName){
    toast.error("Lastname is required")
    return false
  }
  return true;
}

const saveChanges = async ()=>{
  if(validateProfile()){
    try{
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName, lastName, color:selectColor},{withCredentials:true});
      if(response.status === 200){
        setUserInfo({...response.data});
        toast.success("Profile updates successfully");
        navigate('/chat');
      }
    }catch(err){
      console.log(err)
    }
  }
}

const handleNavigate = async ()=>{
  if(userInfo.profileSetup){
    navigate('/chat')
  }else{
    toast.error("Please setup profile first.")
  }
}

const handleFileInputClick = async ()=>{
  fileInputRef.current.click();
}
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profile-image', file);

    try {
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        setimage(response.data.image); // Update the image state directly
        console.log("image response: ",response)
        toast.success("Image Updated Successfully.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image.");
    }
  }
};


const handleDeleteImage = async () => {
  try{
    const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});

    if(response.status === 200){
      setUserInfo({...userInfo, image:null});
      toast.success("Profile image deleted successfully");
      setimage(null);
    }
    console.log(image)
    console.log("Called functios")
  }catch(err){
    console.error({err})
    toast.error("Failed to remove Image.")
  }
}

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="">
            <IoArrowBack className='text-2xl lg:text-4xl text-white/90 cursor-pointer' onClick={handleNavigate}/>
        </div>
        <div className="grid grid-cols-2">
          <div 
          className=" h-auto w-32 md:w-48 relative flex items-center justify-center" 
          onMouseEnter={()=> sethoverd(true)}
          onMouseLeave={()=> sethoverd(false)}
          >
            <Avatar className='h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden'>
              {image ? (
                <AvatarImage 
                src={image}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectColor)}`}>
                  {firstName
                   ? firstName.split("").shift()
                   : userInfo.email.split("").shift()
                  }
                </div>
              )}
            </Avatar>
            {
              hoverd && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer' onClick={image ? handleDeleteImage : handleFileInputClick}>
                  {
                    image ? <FaTrash className='text-white text-3xl cursor-pointer' /> : <FaPlus className='text-white text-3xl cursor-pointer'/>
                  }
                </div>
              )
            }
            <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name='profile-image' accept='.png, .jpg, .jpeg, .svg, .webp' />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input type="email" placeholder='Email' disabled value={userInfo.email} className=' rounded-lg p-6 bg-[#2c2e3b] border-none h-10' />
            </div>
            <div className="w-full">
              <input type="text" placeholder='First Name' value={firstName} onChange={(e)=>setfirstName(e.target.value)} className=' rounded-lg p-6 bg-[#2c2e3b] border-none h-10' />
            </div>
            <div className="w-full">
              <input type="text" placeholder='Last Name' value={lastName} onChange={(e)=>setlastName(e.target.value)} className=' rounded-lg p-6 bg-[#2c2e3b] border-none h-10' />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index)=>(
                <div className={`${color} h-8 w-8 rounded-full cursor-pointer duration-300
                ${
                  selectColor === index 
                  ? " outline outline-white/50 outline-1" : ""
                }
                `}
                key={index}
                onClick={()=>setselectColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button className='h-14 rounded-xl text-white w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300' onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile