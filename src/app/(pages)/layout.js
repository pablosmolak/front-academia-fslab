"use client"

import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { ApplicationContext } from "@/src/context/applicationContext";


export default function LayoutNoAuth({ children }) {
    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    const router = useRouter();

    if (session) {
        "use client"
        const { user, setUser } = useContext(ApplicationContext);

        if (!user?.emailVerificado) {

            // const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            sessionStorage.removeItem('redirectPath');

            router.replace('/verificaremail');
        }
    }


    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-grow mx-28 my-4">
                {children}
            </main>
            <Footer />
            <ReactToastContainer />
        </div>
    );
}
