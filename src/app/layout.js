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
    title: "Academia FSLab – Plataforma de Cursos da Fábrica de Software do IFRO",
    description:
        "A Academia FSLab é a plataforma oficial de cursos desenvolvida pela Fábrica de Software do IFRO. Explore conteúdos técnicos, materiais exclusivos e capacite-se com qualidade.",
    keywords: [
        "Academia FSLab",
        "Fábrica de Software IFRO",
        "cursos online",
        "plataforma de cursos",
        "capacitação tecnológica",
        "FSLab",
        "IFRO"
    ],
    authors: [
        { name: "FSLab", url:`${process.env.NEXT_PUBLIC_FRONT_URL}` },
        { name: "Pablo Smolak", url: "https://github.com/pablosmolak" }
    ],
    creator: "FSLab",
    publisher: "FSLab",
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_FRONT_URL}`),
    openGraph: {
        title: "Academia FSLab – Plataforma de Cursos da Fábrica de Software do IFRO",
        description:
            "Capacite-se com a plataforma de cursos do IFRO, desenvolvida pela Fábrica de Software. Acesse agora a Academia FSLab.",
        url: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
        siteName: "Academia FSLab",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_FRONT_URL}/assets/logo_fslab.png`,
                width: 1200,
                height: 630,
                alt: "Academia FSLab – Plataforma de Cursos do IFRO"
            }
        ],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Academia FSLab – Plataforma de Cursos da Fábrica de Software do IFRO",
        description:
            "Conheça a plataforma de capacitação online da FSLab/IFRO. Cursos técnicos, materiais exclusivos e muito mais.",
        images: [`${process.env.NEXT_PUBLIC_FRONT_URL}/assets/logo_fslab.png`]
    }
};


export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    let resUser;
    let token;

    if (session) {
        token = session.token;
        resUser = {
            ...await getUserInfos(),
            fotoPerfilUrl: handleImagePath(`/usuarios/${session.user.id}/image?time=${Date.now()}`)
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
