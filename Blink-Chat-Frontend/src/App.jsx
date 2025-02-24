import { useEffect, useState } from 'react'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { useAppStore } from './store'
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

export default function App() {

const { userInfo, setUserInfo} = useAppStore();
const [loading, setloading] = useState(true)

useEffect(()=>{
  const getUserData = async ()=>{
    try{
const response = await apiClient.get(GET_USER_INFO,{
  withCredentials: true,
});
if(response.status === 200 && response.data.id){
  setUserInfo(response.data)
}else{
  setUserInfo(undefined)
}
console.log({response})
    }catch(err){
      console.log({err})
      setUserInfo(undefined)
    }finally{
      setloading(false)
    }
  }
    if(!userInfo){
      getUserData();
    }
    else{
      setloading(false)
    }
  
},[userInfo, setUserInfo])

if(loading){
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
    <div className="relative w-16 h-16">
      <div className="absolute w-16 h-16 bg-blue-500 rounded-full animate-ping"></div>
      <div className="absolute w-12 h-12 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute w-8 h-8 bg-white rounded-full animate-blink"></div>
    </div>
  </div>
  )
}

  return (
  <BrowserRouter>
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>} />
    <Route path="/chat" element={<PrivateRoute><Chat/></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />

    <Route path='*' element={<Navigate to="/auth"/>} />
  </Routes>
  </BrowserRouter>
  )
}
