import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '@/assets/Blink.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { SIGNUP_ROUTES, LOGIN_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store';

function Auth() {
    const navigate = useNavigate(); // Hook for navigation
    const { setUserInfo } = useAppStore(); // Zustand function to store user info
    const [email, setemail] = useState(''); // State for email input
    const [password, setpassword] = useState(''); // State for password input
    const [confirm, setconfirm] = useState(''); // State for confirm password input (Signup)


// Login Validation Function

    const validateLogin = () => {
        if (!email.length) {
            toast.error('Email is required.');
            return false;
        }
        if (!validateEmailFormat(email)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (!password.length) {
            toast.error('Password is required.');
            return false;
        }
        return true;
    };


// Signup Validation Function

    const validateSignup = () => {
        if (!email.length) {
            toast.error('Email is required.');
            return false;
        }
        if (!validateEmailFormat(email)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (!password.length) {
            toast.error('Password is required.');
            return false;
        }
        if (password !== confirm) {
            toast.error('Password and confirm password should be same.');
            return false;
        }
        return true;
    };


// Email Format Validation Function

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
        return emailRegex.test(email);
    };


// Login API Request

    const handleLogin = async () => {
        if (validateLogin()) { // Proceed only if validation is successful
          try {
            const response = await apiClient.post(LOGIN_ROUTES, { email, password }, { withCredentials: true });
            console.log('Response:', response.data);
            toast.success('Login successful!');
    
            if (response.data.user.id) {
              setUserInfo(response.data.user); // Store user info in Zustand
              if (response.data.user.profileSetup) navigate('/chat'); // Redirect to chat if profile is set up
              else navigate('/profile'); // Otherwise, go to profile setup
            }
          } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
          }
        }
      };
    

// Signup API Request

const handleSignup = async () => {
    if (validateSignup()) { // Proceed only if validation is successful
      try {
        const response = await apiClient.post(SIGNUP_ROUTES, { email, password }, { withCredentials: true });
        console.log('Response:', response.data);
        toast.success('Signup successful!');

        if (response.status === 201) {
          setUserInfo(response.data.user); // Store user info in Zustand
          navigate('/profile'); // Redirect to profile setup
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
      }
    }
  };

  
// UI Layout
    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gray-100 text-gray-900">
            <div className="h-[80vh] bg-white shadow-2xl w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center p-5">
                    <div className="flex items-center justify-center flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-center">
                            Welcome to Blink Chat
                        </h1>
                        <p className="font-medium text-center text-gray-600">
                            Fill in the details with the best chat app
                        </p>
                    </div>
                    <Tabs className="w-full" defaultValue="login">
                        <TabsList className="flex">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:text-purple-700 data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 border-b-2 w-1/2 p-3 text-center text-gray-800"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="data-[state=active]:text-purple-700 data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 border-b-2 w-1/2 p-3 text-center text-gray-800"
                            >
                                Signup
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="flex flex-col gap-5 mt-5">
                            <TextField
                                label="Email"
                                type="email"
                                color="secondary"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                color="secondary"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <Button className="bg-purple-700" onClick={handleLogin}>
                                Login
                            </Button>
                        </TabsContent>
                        <TabsContent value="signup" className="flex flex-col gap-5 mt-5">
                            <TextField
                                label="Email"
                                type="email"
                                color="secondary"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                color="secondary"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                color="secondary"
                                variant="outlined"
                                value={confirm}
                                onChange={(e) => setconfirm(e.target.value)}
                            />
                            <Button className="bg-purple-700" onClick={handleSignup}>
                                Signup
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="background login" className="h-[65vh]" />
                </div>
            </div>
        </div>
    );
}

export default Auth;
