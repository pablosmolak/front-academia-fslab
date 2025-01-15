"use client"
import ButtonLoading from "@/components/buttonLoading";
import { AppSidebar } from "@/components/player/app-sidebar";
import { SemInscricaoAlert } from "@/components/player/sem-inscricao-alert";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchApi } from "@/src/utils/fetchApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

    if (session) {
        if (!session.user.emailVerificado) {
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
            queryKey: ["getInscricao", cursoId],
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
        error: errorProgresso
    } = useQuery({
        queryKey: ["getProgresso", cursoId],
        queryFn: async () => {
            const response = await fetchApi(`/progressos/curso/${cursoId}`, "GET");

            console.log(response)

            if (response.error) {
                throw response.errors;
            } else {
                return response.data[0]
            }
        }
    })

    const queryClient = useQueryClient();

    const { mutate: finalizarAtividade, isPending: isLoadingFinalizarAtividade } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/progressos/finalizaratividade/${conteudo.id}`, "POST")
            if (response.error) {
                throw new Error(response.message);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getProgresso", cursoId]);
        },
        onError: (error) => {
            console.error(`Erro ao criar inscrição: ${error}`);
        },
    });

    return (
        <div>
            <SidebarProvider>
                <AppSidebar
                    onVideoChange={(url) => setConteudo(url)}
                    cursoId={cursoId}
                    progresso={progresso}
                />
                <main className="w-full bg-black flex flex-col items-center">
                    {!isLoadingInscricao && conteudo && inscricao.length === 0 && (
                        <SemInscricaoAlert cursoId={cursoId} />
                    )}
                    <div className="bg-zinc-800 h-20 flex items-center justify-center relative w-full">
                        <SidebarTrigger className="absolute left-1 hover:bg-zinc-700" />
                        <p className="text-white">{`${conteudo?.titulo} - ${conteudo?.id}`}</p>
                    </div>
                    <div className="flex-grow flex items-center justify-center w-full">
                        <YouTubePlayer videoUrl={conteudo?.conteudo} />
                    </div>
                    <div>
                        <ButtonLoading
                            isLoading={isLoadingFinalizarAtividade}
                            type="button"
                            onClick={() => { finalizarAtividade() }}
                        >
                            Finalizar Conteúdo
                        </ButtonLoading>
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}