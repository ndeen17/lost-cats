import { createContext, useContext, ReactNode } from 'react';

// Create UserContext with default values
const UserContext = createContext<any>(null);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Context Provider to wrap the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
    // This context will not manage any user data or side effects anymore.

    return (
        <UserContext.Provider value={{ userName: null, ctsBalance: 0, updateCtsBalance: () => {}, setChatId: () => {} }}>
            {children}
        </UserContext.Provider>
    );
};
