"use client"
import { AppSidebar } from "@/components/player/app-sidebar";
import TopBar from "@/components/app/TopBar";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { getSessionClient } from "@/src/utils/getSessionClient";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function playerPage() {
    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    if (!session) {
        redirect("/login")
    }

    const [conteudo, setConteudo] = useState();

    return (
        <div>
            <SidebarProvider>
                <AppSidebar onVideoChange={(url) => setConteudo(url)} />
                <main className="w-full bg-black">
                    <div className="bg-zinc-800 h-20 flex items-center justify-center relative ">
                        <SidebarTrigger className="absolute left-1" />
                        <p className="text-white">{conteudo?.titulo}</p>
                    </div>
                    <YouTubePlayer videoUrl={conteudo?.conteudo} />
                </main>
            </SidebarProvider>
        </div>
    );
}