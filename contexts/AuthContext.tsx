import { createContext, useState, ReactNode, FC, useContext } from "react";

// Create the context with proper typing
const AuthContext = createContext(null);

export const AuthProvider = ({ children } : {children:any}) => {
  const [user, setUser] = useState<User | null>(null);

  // Set the entire user object
  const setAuth = (authUser: any) => {
    setUser(authUser);
  };

  // Update specific fields of the user object
  const setUserData = (userData: any) => {
    setUser({...userData});
  };

  return (
    <AuthContext.Provider value={{user, setAuth, setUserData}}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);