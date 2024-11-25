"use client";

import { createContext, useState } from "react";

export const ApplicationContext = createContext({});

export function ApplicationProvider({ children,/* enums, permissions, grupos,*/ user }) {

  //const [enumsState, setEnumsState] = useState(enums);
 // const [permissionsState, setPermissionsState] = useState(permissions);
 // const [gruposState, setGruposState] = useState(grupos);
  const [userState, setUserState] = useState(user);

  return (
    <ApplicationContext.Provider
      value={{
     //   enums: enumsState,
      //  permissions: permissionsState,
      //  grupos: gruposState,
        user: userState
      }}>
      {children}
    </ApplicationContext.Provider>
  )
}
