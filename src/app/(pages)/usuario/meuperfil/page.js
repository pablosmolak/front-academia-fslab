"use client"

import EditarPerfilDialog from "@/components/Perfil/editarPerfilDialog";
import ListaExpansiva from "@/components/Perfil/list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

                console.log(response)

                if (response.error) {
                    throw response
                } else {
                    return response.data[0] || null
                }
            },
            enabled: !!userId,
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

                    console.log(response.data)
                    return response.data || null
                }
            },
            enabled: !!userId,
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404) {
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
            enabled: !!userId,
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404) {
                    return false;
                }

                return failureCount < 3;
            }
        })


    return (
        <>
            {!isLoadingUsuario && !isErrorUsuario && (
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
                    {!userContext?.emailVerificado && (
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
                    )}
                    <section className="
                        flex flex-col
                        md:justify-between 
                       
                       
                        py-8 px-4 xl:px-36 
                        gap-4 xl:gap-4">
                        <ListaExpansiva titulo="Andamento" data={inscricoesEmAndamento} />

                        <ListaExpansiva titulo="Certificados" data={certificados} />

                    </section>
                </div>


            )}
        </>
    )
}