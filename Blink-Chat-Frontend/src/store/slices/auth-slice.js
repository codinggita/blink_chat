// Creating a zustand function that is used to manage userInfo

export const createAuthSlice = (set)=>(
    {
        userInfo:undefined, //Initial value of userInfo
        setUserInfo: (userInfo)=> set({userInfo}) // Seting it's value
    }
)