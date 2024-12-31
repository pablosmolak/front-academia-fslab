"use client"

import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LayoutNoAuth({ children }) {
    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    console.log(session)

    if (session) {
        if (!session.user?.emailVerificado) {
           // redirect("/verificaremail")
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
