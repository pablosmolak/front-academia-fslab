import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "../providers/sessionProvider";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ApplicationProvider } from "../context/applicationContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Academia FSLab",
    description: "Projeto Fabrica de Software",
};

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    //const token = await getCookie("accessToken");

    let resUser
    let token

    if (session) {
        resUser = session.user
        token = session.token
    }



    return (
        <html lang="pt-BR">
            <NextAuthSessionProvider>
                <ReactQueryProvider>
                    <ApplicationProvider
                        user={resUser}
                        token={token}
                    >

                        <body className={inter.className}>{children}</body>
                    </ApplicationProvider>
                </ReactQueryProvider>
            </NextAuthSessionProvider>
        </html>
    );
}
