"use client"

import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";



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
                       { curso.instrutores?.map(instrutor => <p>{instrutor.nome}</p>)}
                    </div>

                    <div>
                        {curso.categorias?.map(categoria => <p>{categoria}</p>)}
                    </div>
                    <div>
                        {curso.cargaHoraria}
                    </div>
                </div>
            )}
        </>
    )
}