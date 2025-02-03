"use client"

import Footer from "@/components/app/Footer";
import TopBar from "@/components/app/TopBar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext } from "react";


export default function LayoutNoAuth({ children }) {
    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

    const { user } = useContext(ApplicationContext);
    if (session) {

        if (!user?.emailVerificado) {
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