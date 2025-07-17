"use client";

import { createContext, useState } from "react";

export const ApplicationContext = createContext({});

export function ApplicationProvider({ children,/* enums, permissions, grupos,*/ user }) {

    const [userState, setUserState] = useState(user);

    return (
        <ApplicationContext.Provider
            value={{
                //   enums: enumsState,
                //  permissions: permissionsState,
                //  grupos: gruposState,
                user: userState,
                setUser: setUserState
            }}>
            {children}
        </ApplicationContext.Provider>
    )
}
