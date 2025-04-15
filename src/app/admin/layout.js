"use client"

import { AppSidebar } from "@/components/admin/appsidebar";
import Footer from "@/components/app/Footer";
import TopBar from "@/components/app/TopBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext } from "react";


export default function LayoutNoAuth({ children }) {
    // const { data: session } = useSession({
    //     required: false,
    //     refetchInterval: 30,
    // });

    // const { user } = useContext(ApplicationContext);
    // if (session) {

    //     if (!user?.emailVerificado) {
    //         redirect('/verificaremail');
    //     }
    // }

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar className="fixed top-0 left-0  w-full h-16 z-10"/>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-grow">
                    <SidebarTrigger className="absolute left-1 hover:bg-zinc-700" />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}