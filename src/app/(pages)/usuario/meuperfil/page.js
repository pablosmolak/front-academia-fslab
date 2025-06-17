"use client"

import EditarPerfilDialog from "@/components/Perfil/editarPerfilDialog";
import ListaAndamento from "@/components/Perfil/listaAndamento";
import ListaCertificados from "@/components/Perfil/listaCertificados";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationContext } from "@/src/context/applicationContext";
import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext } from "react";


export default function MeuPerfilPage() {
    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

    const userId = session?.user?.id

    const { user: userContext } = useContext(ApplicationContext);

    const nomesSingulares = {
        "Cursantes": "Cursante",
        "Ministrantes": "Ministrante",
        "Administradores": 'Administrador',
    };

    const {
        data: usuario,
        isLoading: isLoadingUsuario,
        isError: isErrorUsuario,
        error: errorUsuario } = useQuery({
            queryKey: ["meuperfil", userId],
            queryFn: async () => {
                const response = await fetchApi(`/usuarios/${userId}`, "GET");

                if (response.error) {
                    throw response
                } else {
                    return response.data[0] || null
                }
            },
            //  enabled: !!userId,
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404) {
                    return false;
                }

                return failureCount < 3;
            }
        })


    const {
        data: certificados,
        isLoading: isLoadingCertificados,
        isError: isErrorCertificados,
        error: errorCertificados } = useQuery({
            queryKey: ["meuperfilcertificados", userId],
            queryFn: async () => {
                const response = await fetchApi(`/certificados/usuario/${userId}`, "GET");

                if (response.error) {
                    throw response
                } else {
                    return response.data || null
                }
            },
            /// enabled: !!userId,
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404 || error?.code === 401) {
                    return false;
                }

                return failureCount < 3;
            }
        })



    const {
        data: inscricoesEmAndamento,
        isLoading: isLoadingInscricoesEmAndamento,
        isError: isErrorInscricoesEmAndamento,
        error: errorInscricoesEmAndamento } = useQuery({
            queryKey: ["meuperfilinscricoesemandamento", userId],
            queryFn: async () => {
                const response = await fetchApi(`/inscricoes/usuario`, "GET");

                if (response.error) {
                    throw response
                } else {

                    const inscricoes = response.data.filter((inscricao) => {
                        return inscricao.status === "Em Andamento"
                    })

                    return inscricoes || null
                }
            },
            // enabled: !!userId,
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404 || error?.code === 401) {
                    return false;
                }

                return failureCount < 3;
            }
        })


    const isLoading = isLoadingUsuario || isLoadingCertificados || isLoadingInscricoesEmAndamento

    if (!isLoading) {
        return (
            <>
                <div>
                    <section className="
                            flex flex-col md:flex-row
                            md:justify-between 
                            items-center 
                            bg-zinc-400  
                            py-8 px-4 xl:px-36 
                            gap-4 xl:gap-4"
                    >
                        <div>
                            <h3 className="
                                text-md xl:text-lg 
                                text-center md:text-start
                                font-bold 
                                break-words 
                                whitespace-normal 
                                max-w-[800px]"
                            >
                                {nomesSingulares[userContext?.grupo] ?? userContext?.grupo}
                            </h3>
                            <h1 className="
                                text-2xl xl:text-3xl 
                                text-center md:text-start
                                font-bold 
                                break-words 
                                whitespace-normal 
                                max-w-[800px]"
                            >
                                {userContext?.name}
                            </h1>
                        </div>

                        <div className="
                                flex flex-col 
                                bg-white 
                                w-[290px] sm:w-[320px] lg:w-[350px]
                                h-full 
                                rounded-sm
                                gap-4
                                items-center 
                                p-5"
                        >
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={userContext?.fotoPerfilUrl} />
                                <AvatarFallback>
                                    {userContext?.name?.trim().slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <EditarPerfilDialog usuario={usuario} />
                        </div>
                    </section>
                    {!userContext?.emailVerificado ? (
                        <div className="
                                flex flex-col 
                                items-center 
                                justify-center 
                                bg-red-100 
                                border border-red-300 
                                text-red-800 
                                w-full 
                                rounded-md 
                                p-6 
                                shadow-sm
                            ">
                            <h1 className="
                                    text-2xl xl:text-3xl 
                                    font-semibold 
                                    text-center 
                                    mb-2
                                ">
                                Email não verificado
                            </h1>
                            <p className="text-sm text-center mb-4">
                                Verifique seu email para acessar todas as funcionalidades da plataforma.
                            </p>
                            <a
                                href="/verificaremail"
                                className="
                                        px-5 
                                        py-2 
                                        bg-red-600 
                                        hover:bg-red-700 
                                        text-white 
                                        text-sm 
                                        rounded 
                                        transition 
                                        duration-200 
                                        shadow-md
                                    "
                            >
                                Verificar email
                            </a>
                        </div>
                    ) : (
                        <section className="
                                flex flex-col
                                md:justify-between 
                                py-8 px-4 xl:px-36 
                                gap-4 xl:gap-4"
                        >
                            <ListaAndamento data={inscricoesEmAndamento} />
                            <ListaCertificados data={certificados} />
                        </section>
                    )}
                </div>
            </>
        )
    }

    if (isLoading) {
        return (
            <>

                <section className="flex flex-col md:flex-row md:justify-between items-center bg-zinc-400 py-8 px-4 xl:px-36 gap-4 xl:gap-4">
                    <div className="justify-items-center md:justify-items-start space-y-2 max-w-[800px] w-full">
                        <Skeleton className="h-5 w-3/4 md:w-1/2" />
                        <Skeleton className="h-8 w-5/6 md:w-2/3" />
                    </div>

                    <div className="flex flex-col bg-white w-[290px] sm:w-[320px] lg:w-[350px] h-full rounded-sm gap-4 items-center p-5">
                        <Skeleton className="rounded-full w-16 h-16" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </section>

                <section className="flex flex-col py-8 px-4 xl:px-36 gap-4 xl:gap-4">

                    <div className="mt-4">
                        <h2 className="text-xl xl:text-3xl font-semibold mb-6 text-center md:text-start">
                            Cursos em andamento
                        </h2>

                        <section>
                            <div
                                className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] 
                                gap-6 justify-items-center sm:place-content-center"
                            >
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Card
                                        key={index}
                                        className="w-full max-w-[25rem] h-[26rem] max-h-[26rem] md:h-[23rem] md:max-h-[23rem] flex flex-col"
                                    >
                                        <CardHeader>
                                            <Skeleton className="w-full h-40 rounded-sm" />
                                        </CardHeader>

                                        <CardContent className="grow flex gap-2 flex-col">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>

                                        <CardFooter>
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl xl:text-3xl font-semibold mb-6 text-center md:text-start">
                            Certificados
                        </h2>

                        <section>
                            <div
                                className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] 
                                gap-6 justify-items-center sm:place-content-center"
                            >
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Card
                                        key={index}
                                        className="w-full max-w-[25rem] h-[26rem] max-h-[26rem] md:h-[23rem] md:max-h-[23rem] flex flex-col"
                                    >
                                        <CardHeader>
                                            <Skeleton className="w-full h-40 rounded-sm" />
                                        </CardHeader>

                                        <CardContent className="grow flex gap-2 flex-col">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>

                                        <CardFooter>
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>
                </section>
            </>
        )
    }
}