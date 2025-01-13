"use client"
import { AppSidebar } from "@/components/player/app-sidebar";
import { SemInscricaoAlert } from "@/components/player/sem-inscricao-alert";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";


export default function playerPage({ params }) {

    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    if (status === 'unauthenticated') {
        sessionStorage.setItem('redirectPath', window.location.pathname);
        redirect("/login");
    }

    if(session){
        if(!session.user.emailVerificado){
            sessionStorage.setItem('redirectPath', window.location.pathname);
            redirect("/verificaremail");
        }
    }

    const cursoId = params.slug

    const [conteudo, setConteudo] = useState();

    const {
        data: inscricao = [],
        isLoading: isLoadingInscricao,
        isError: isErrorInscricao,
        error: errorInscricao } = useQuery({
            queryKey: ["getInscricao"],
            queryFn: async () => {
                const response = await fetchApi(`/inscricoes/usuario/curso/${cursoId}`, "GET");

                if (response.error) {
                    throw response.errors;
                } else {
                    return response.data
                }
            }
        })

    const {
        data: progresso,
        isLoading: isLoadingProgresso,
        isError: isErrorProgresso,
        error: errorProgresso } = useQuery({
            queryKey: ["getProgresso"],
            queryFn: async () => {
                const response = await fetchApi(`/progressos/curso/${cursoId}`, "GET");

                if (response.error) {
                    throw response.errors;
                } else {
                    return response.data[0]
                }
            }
        })

    return (
        <div>
            <SidebarProvider>
                <AppSidebar onVideoChange={(url) => setConteudo(url)} cursoId={cursoId} progresso={progresso} />
                <main className="w-full bg-black">
                    {!isLoadingInscricao && inscricao.length === 0 && (
                        <SemInscricaoAlert cursoId={cursoId} />
                    )}
                    <div className="bg-zinc-800 h-20 flex items-center justify-center relative ">
                        <SidebarTrigger className="absolute left-1" />
                        <p className="text-white">{`${conteudo?.titulo} - ${conteudo?.id}`}</p>
                    </div>
                    <YouTubePlayer videoUrl={conteudo?.conteudo} />
                </main>
            </SidebarProvider>
        </div>
    );
}