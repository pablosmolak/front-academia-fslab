"use client"

import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";


export default function LayoutNoAuth({ children }) {
    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

    if (session) {

        const { user } = useContext(ApplicationContext);

        console.log(user);

        if (!user?.emailVerificado) {
            redirect('/verificaremail');
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
