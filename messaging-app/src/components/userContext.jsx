import React, { Children, createContext, useContext, useState } from 'react';
const UserContext = createContext()
export const UserProvider = () => {
const [user,setUser] = useState(null)
    return (
        <UserContext.Provider value={{user, setUser}} >
            {Children}
        </UserContext.Provider>
    );
}

export const useUser = ()=>useContext(UserContext)
