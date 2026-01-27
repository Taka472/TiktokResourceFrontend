import { createContext, useContext, useState } from "react";

const LockContext = createContext();

export const LockProvider = ({ children }) => {
    const [locked, setLocked] = useState(true);

    const unlock = () => {
        setLocked(false);
        return true;
    };

    const lock = () => {setLocked(true)};

    return (
        <LockContext.Provider value = {{ locked, lock, unlock }}>
            {children}
        </LockContext.Provider>
    )
}

export const useLock = () => useContext(LockContext);