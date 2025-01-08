"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";


export default function playerPage() {
    const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");

    return (
        <SidebarProvider>
            <AppSidebar onVideoChange={(url) => setVideoUrl(url)} />
            <main>
                <SidebarTrigger />
                <iframe
                    width="560"
                    height="315"
                    src={videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </main>
        </SidebarProvider>
    );
}
