"use client"

import Footer from "@/components/app/Footer";
import TopBar from "@/components/app/TopBar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { useContext } from "react";


export default function LayoutNoAuth({ children }) {
    const pathname = usePathname();

    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

    const { user } = useContext(ApplicationContext);

    if (session) {
        const ignorarVerificacao = pathname === '/usuario/meuperfil';

        if (!user?.emailVerificado && !ignorarVerificacao) {
            redirect('/verificaremail');
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}