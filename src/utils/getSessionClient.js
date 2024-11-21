import { getSession } from "next-auth/react";

export async function getSessionClient() {
  const session = await getSession();
  
  return session?.token;
}
