"use client";

import { createContext, useState } from "react";

export const ApplicationContext = createContext({});

export function ApplicationProvider({ children, user }) {

  const [userState, setUserState] = useState(user);

  return (
    <ApplicationContext.Provider
      value={{
        user: userState
      }}>
      {children}
    </ApplicationContext.Provider>
  )
}