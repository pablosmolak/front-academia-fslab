"use client"

import EditarPerfilDialog from "@/components/editarPerfil/editarPerfilDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApplicationContext } from "@/src/context/applicationContext";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext } from "react";


export default function MeuPerfilPage() {

    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

    const userId = session?.user?.id

     const { user:userContext } = useContext(ApplicationContext);


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

    return (
        <>
            {!isLoadingUsuario && !isErrorUsuario && (
                <div>
                    <section className="
                        flex flex-col  md:flex-row
                        md:justify-between 
                        items-center 
                        bg-zinc-400  
                        py-8 px-4 xl:px-36 
                        gap-4 xl:gap-4"
                    >
                        <div>
                            <h3 className="
                            text-2xl xl:text-3xl 
                            text-center md:text-start
                            font-bold 
                            break-words 
                            whitespace-normal 
                            max-w-[800px]"
                            >
                                {nomesSingulares[usuario?.Grupo.nome] ?? usuario?.Grupo.nome}
                            </h3>
                            <h1 className="
                            text-2xl xl:text-3xl 
                            text-center md:text-start
                            font-bold 
                            break-words 
                            whitespace-normal 
                            max-w-[800px]"
                            >
                                {usuario?.nome}
                            </h1>
                        </div>



                        <div className="
                            flex flex-col 
                            bg-white 
                            w-[290px] sm:w-[320px] lg:w-[350px]
                            h-full 
                            rounded-sm
                            
                            items-center 
                            p-5"
                        >
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={userContext.FotoPerfilUrl} />
                                <AvatarFallback>
                                    {usuario?.nome.trim().slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <EditarPerfilDialog usuario={usuario} />

                        </div>
                    </section>
                </div>
            )}
        </>
    )
}