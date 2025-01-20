"use client"
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { AppSidebar } from "@/components/player/Player-sidebar";
import CourseCompletion, { PlayerCertificadoPage } from "@/components/player/player-certificado";
import { ProximoConteudoButton } from "@/components/player/proximo-conteudo-button";
import { SemInscricaoAlert } from "@/components/player/sem-inscricao-alert";
import { YouTubePlayer } from "@/components/player/youtube-player";
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
    const [videoNofim, setVideoNofim] = useState(false)
    const [cursoRecemFinalizado, setCursoRecemFinalizado] = useState(false)

    const queryClient = useQueryClient();

    const { mutate: criarInscricao, isLoading: isLoadingCriarInscricao } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/inscricoes`, "POST", { cursoId });

            if (response.error) {
                throw response.errors;
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getInscricao", cursoId]);
            queryClient.invalidateQueries(["getProgresso", cursoId]);
        },
        onError: (error) => {
            toast.error("Erro ao tentar efetuar a inscrição!");
        },
    });

    const inscrever = sessionStorage.getItem('inscreverNoCurso')
    sessionStorage.removeItem('inscreverNoCurso');
    if (inscrever) {
        criarInscricao()
    }

    const {
        data: progresso,
        isLoading: isLoadingProgresso,
        isError: isErrorProgresso,
        error: errorProgresso
    } = useQuery({
        queryKey: ["getProgresso", cursoId],
        queryFn: async () => {
            const response = await fetchApi(`/progressos/curso/${cursoId}`, "GET");

            if (response.error) {
                throw response.errors;
            } else {
                return response.data[0]
            }
        }
    })

    const {
        data: curso,
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ["getCursosPlayer", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/cursos/publicados/${cursoId}`, "GET");
                if (response.error) {
                    throw response.errors;
                }
                return response.data[0];
            }
        });

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

    if (status === "authenticated") {
        return (
            <div>
                <TopBar className="fixed top-0 left-0  w-full h-16 z-10" />
                <SidebarProvider>
                    <AppSidebar
                        onVideoChange={(url) => setConteudo(url)}
                        curso={curso}
                        progresso={progresso}
                        conteudoSelecionado={conteudo}
                    />
                    <main className="w-full bg-black flex flex-col items-center">
                        {!isLoadingInscricao && inscricao.length === 0 && (
                            <SemInscricaoAlert
                                cursoId={cursoId}
                                criarInscricao={() => criarInscricao()}
                                sLoadingCriarInscricao={isLoadingCriarInscricao} />
                        )}
                        <div className="bg-zinc-800 h-20 flex items-center justify-center relative w-full mt-16">
                            <SidebarTrigger className="absolute left-1 hover:bg-zinc-700" />
                            <p className="text-white">{conteudo?.titulo || ""}</p>
                        </div>
                        <div className="flex-grow flex flex-col items-center justify-center w-full">
                            {

                                cursoRecemFinalizado && (
                                    <PlayerCertificadoPage />
                                )
                                ||

                                (
                                    <>
                                        <YouTubePlayer
                                            videoUrl={conteudo?.conteudo}
                                            onChangeFinalVideo={(final) => setVideoNofim(final)}
                                        />

                                        <div className="w-4/5 h-14 flex justify-center md:justify-end md: pt-4">
                                            <ProximoConteudoButton
                                                progresso={progresso}
                                                videoNofim={videoNofim}
                                                conteudo={conteudo}
                                                curso={curso}
                                                onVideoChange={(url) => setConteudo(url)}
                                                onRecemFinalizadoChange={(recemFinalizado) => setCursoRecemFinalizado(recemFinalizado)}
                                            />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </main>
                </SidebarProvider>
                <ReactToastContainer />
            </div>
        );
    }
}