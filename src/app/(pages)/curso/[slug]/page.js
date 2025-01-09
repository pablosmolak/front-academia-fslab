"use client"

import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { handleImagePath } from "@/src/utils/handleImagePath";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function cursoPage({ params }) {

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
                        <h1 className="text-2xl font-bold">
                            {curso.nomeCurso}
                        </h1>

                        <p className="my-3 text-justify">
                            {curso.descricao}
                        </p>
                    </div>

                    <div className="
                        flex
                        justify-center 
                        my-3
                    "
                    >
                        <Link
                            href={`/curso/${curso.id}/player`}
                            className="
                            w-52
                            flex 
                            justify-center 
                            items-center 
                            py-2 
                            rounded-sm
                            bg-primary
                            "
                        >
                            <p>Assistir</p>
                        </Link>
                    </div>

                    {/* Container para tópicos e instrutores */}
                    <div className={`flex ${curso.categorias?.length <= 3 && curso.instrutores?.length <= 3 ? 'flex-row items-start' : 'flex-col mt-4'}`}>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-start my-2">Tópicos abordados:</h2>
                            <ul
                                className={`list-disc pl-5 grid gap-4 ${curso.categorias?.length > 3 ? 'grid-cols-3' : ''} `}
                            >
                                {curso.categorias?.map(categoria => (
                                    <li key={categoria}>{categoria}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Instrutores */}
                        <div className="flex-1 mt-4 sm:mt-0">
                            <h2 className="font-bold text-lg text-start my-2">{curso.instrutores?.length > 1 ? 'Instrutores:' : 'Instrutor:'}</h2>
                            <div
                                className={`grid gap-4 ${curso.instrutores?.length > 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
                            >
                                {curso.instrutores?.map(instrutor => (
                                    <Link
                                        key={instrutor.id}
                                        href={`http://localhost:3100/usuarios/${instrutor.id}`}
                                    >
                                        <Card className="w-40 flex-shrink-0">
                                            <CardHeader>
                                                <Avatar className="h-28 w-28">
                                                    <AvatarImage src={handleImagePath(`/usuarios/${instrutor.id}/image`)} />
                                                    <AvatarFallback>{instrutor.nome.trim().slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </CardHeader>
                                            <CardFooter>
                                                <p>{instrutor.nome}</p>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}