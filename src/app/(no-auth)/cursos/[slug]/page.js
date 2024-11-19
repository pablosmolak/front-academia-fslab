"use client"

import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { handleImagePath } from "@/src/utils/handleImagePath";

export default function EditarInspecaoPage({ params }) {

    const router = useRouter();

    const {
        data: curso,
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ["getCursos"],
            queryFn: async () => {
                const response = await fetchApi(`/cursos/informacoes/${params.slug}`, "GET");

                if (response.error) {
                    throw response.errors;
                } else {
                    return response.data[0]
                }
            }
        })

    return (
        <>
            {!isLoading && (
                <div>

                    <div>
                        {curso.nomeCurso}
                    </div>

                    <div>
                        {curso.descricao}
                    </div>

                    <div>
                        {curso.instrutores?.map(instrutor => (
                            <p>{instrutor.nome}</p>
                        ))}
                    </div>

                    <div>
                        {curso.categorias?.map(categoria => <p>{categoria}</p>)}
                    </div>
                    <div>
                        {curso.cargaHoraria}
                    </div>
                    <div>
                        {curso.instrutores?.map(instrutor => (
                            <Avatar key={instrutor.id} className="h-28 w-28">
                                <AvatarImage src={handleImagePath(`/usuarios/${instrutor.id}/image`)} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}