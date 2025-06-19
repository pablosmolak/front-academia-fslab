"use client"

import TopBar from "@/components/app/TopBar";
import { PlayerCertificadoPage } from "@/components/player/player-certificado";
import { AppSidebar } from "@/components/player/player-sidebar";
import { ProximoConteudoButton } from "@/components/player/proximo-conteudo-button";
import { SemInscricaoAlert } from "@/components/player/sem-inscricao-alert";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { fetchApi } from "@/src/utils/fetchApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function playerPage({ params }) {

    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    if (status === 'unauthenticated') {
        sessionStorage.setItem('redirectPath', window.location.pathname);
        redirect("/login");
    }

    const { user } = useContext(ApplicationContext);
    if (session) {
        if (!user?.emailVerificado) {
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

            setInscreverAlert(false);
        },
        onError: (error) => {
            toast.error("Erro ao tentar efetuar a inscrição!");
        },
    });

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

    const {
        data: certificado,
        isLoading: isLoadingCertificado,
        isError: isErrorCertificado,
        error: errorCertificado
    } = useQuery({
        queryKey: ["getCertificado", cursoId],
        queryFn: async () => {
            const response = await fetchApi(`/certificados/usuario/curso/${cursoId}`, "GET");

            if (response.error) {
                throw response.errors;
            } else {
                return response.data[0]
            }
        }
    })

    const [inscreverAlert, setInscreverAlert] = useState(false);

    useEffect(() => {
        const inscrever = sessionStorage.getItem('inscreverNoCurso');

        if (inscrever && inscricao.length === 0 && !isLoadingInscricao) {
            criarInscricao();
            sessionStorage.removeItem('inscreverNoCurso');
        }

        if (inscrever && inscricao.length > 0 && !isLoadingInscricao) {
            sessionStorage.removeItem('inscreverNoCurso');
        }

        if (!inscrever && inscricao.length === 0 && !isLoadingInscricao) {
            setInscreverAlert(true);
        }

    }, [isLoadingInscricao]);

    if (status === "authenticated") {
        return (
            <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
                <TopBar className="fixed top-0 left-0 w-full h-16 z-50" />

                <SidebarProvider>
                    <AppSidebar
                        onVideoChange={(url) => setConteudo(url)}
                        curso={curso}
                        progresso={progresso}
                        conteudoSelecionado={conteudo}
                        certificado={certificado}
                    />

                    <div className="pt-16 flex flex-col flex-grow overflow-hidden">

                        <div className="sticky top-0 z-40 bg-zinc-800 min-h-20 py-2 px-16 flex items-center justify-center w-full text-center">
                            <SidebarTrigger 
                                data-test="triggerSidebarPlayer" 
                                className="absolute left-1 hover:bg-zinc-700" 
                            />
                            <p className="text-white break-words">{conteudo?.titulo || ""}</p>
                        </div>

                        <main className="flex-1 overflow-y-auto px-4 pt-8 pb-2 flex flex-col items-center space-y-6">
                            {inscreverAlert && (
                                <SemInscricaoAlert
                                    cursoId={cursoId}
                                    criarInscricao={() => criarInscricao()}
                                    LoadingCriarInscricao={isLoadingCriarInscricao}
                                />
                            )}
                            
                            {cursoRecemFinalizado && (
                                <div className="w-full h-full max-w-[640px] 2xl:max-w-[1160px] items-center">
                                    <PlayerCertificadoPage certificadoValidador={certificado?.validador} />
                                </div>
                            )}

                            {!cursoRecemFinalizado && (
                                <section className="w-full max-w-[640px] 2xl:max-w-[1160px] flex flex-col items-center space-y-4">

                                    <YouTubePlayer
                                        videoUrl={conteudo?.conteudo}
                                        onChangeFinalVideo={(final) => setVideoNofim(final)}
                                    />

                                    <div className="h-14 w-full  flex justify-center md:justify-end">
                                        <ProximoConteudoButton
                                            progresso={progresso}
                                            videoNofim={videoNofim}
                                            conteudo={conteudo}
                                            curso={curso}
                                            onVideoChange={(url) => setConteudo(url)}
                                            onRecemFinalizadoChange={(recemFinalizado) => setCursoRecemFinalizado(recemFinalizado)}
                                        />
                                    </div>
                                </section>
                            )}
                        </main>
                    </div>
                </SidebarProvider>
            </div>
        );
    }
}