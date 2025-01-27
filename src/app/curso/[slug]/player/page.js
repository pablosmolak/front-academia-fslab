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

    console.log(curso)

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
            <div>
                <TopBar className="fixed top-0 left-0  w-full h-16 z-10" />
                <SidebarProvider>
                    <AppSidebar
                        onVideoChange={(url) => setConteudo(url)}
                        curso={curso}
                        progresso={progresso}
                        conteudoSelecionado={conteudo}
                        certificado={certificado}
                    />
                    <main className="w-full bg-black flex flex-col items-center">
                        {inscreverAlert && (
                            <SemInscricaoAlert
                                cursoId={cursoId}
                                criarInscricao={() => criarInscricao()}
                                LoadingCriarInscricao={isLoadingCriarInscricao}
                            />
                        )}
                        <div className="bg-zinc-800 h-20 flex items-center justify-center relative w-full mt-16">
                            <SidebarTrigger className="absolute left-1 hover:bg-zinc-700" />
                            <p className="text-white">{conteudo?.titulo || ""}</p>
                        </div>
                        <div className="relative flex-grow flex flex-col items-center justify-center w-full">
                            <div
                                className={`absolute inset-0 flex flex-col 
                                    items-center justify-center w-full  
                                    ease-in-out ${cursoRecemFinalizado ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                <PlayerCertificadoPage certificadoValidador={certificado?.validador} />
                            </div>

                            {/* YouTubePlayer e ProximoConteudoButton */}
                            <div
                                className={`absolute inset-0 flex flex-col items-center justify-center w-full
                                     ease-in-out ${cursoRecemFinalizado ? 'opacity-0 z-0' : 'opacity-100 z-10'
                                    }`}
                            >
                                <>
                                    <YouTubePlayer
                                        videoUrl={conteudo?.conteudo}
                                        onChangeFinalVideo={(final) => setVideoNofim(final)}
                                    />

                                    <div className="w-4/5 h-14 flex justify-center md:justify-end pt-4">
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
                            </div>
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        );
    }
}