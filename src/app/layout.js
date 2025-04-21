import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { getUserInfos } from "../actions/authAction";
import { ApplicationProvider } from "../context/applicationContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import NextAuthSessionProvider from "../providers/sessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import { handleImagePath } from "../utils/handleImagePath";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Academia FSLab",
    description: "Projeto Fabrica de Software"
};

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    let resUser;
    let token;

    if (session) {
        token = session.token;
        resUser ={ 
            ...await getUserInfos(),
            FotoPerfilUrl: handleImagePath(`/usuarios/${session.user.id}/image?time=${Date.now()}`)
        }
    }

    return (
        <html lang="pt-BR">
            <NextAuthSessionProvider>
                <ReactQueryProvider>
                    <ApplicationProvider user={resUser} token={token}>
                        <body className={inter.className}>
                            <ReactToastContainer />
                            {children}
                        </body>
                    </ApplicationProvider>
                </ReactQueryProvider>
            </NextAuthSessionProvider>
        </html>
    );
}
