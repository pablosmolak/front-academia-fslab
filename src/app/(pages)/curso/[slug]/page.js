"use client"

import ButtonLoading from "@/components/buttonLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function cursoPage({ params }) {

    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    const router = useRouter();

    const cursoId = params.slug

    const {
        data: curso,
        isLoading: isLoadingCurso,
        isError: isErrorCurso,
        error: errorCurso } = useQuery({
            queryKey: ["cursos", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/cursos/publicados/informacoes/${cursoId}`, "GET");

                if (response.error) {
                    throw response.errors;
                } else {
                    return response.data[0]
                }
            }
        })

    const {
        data: inscricao,
        isLoading: isLoadingInscricao,
        isError: isErrorInscricao,
        error: errorInscricao } = useQuery({
            queryKey: ["inscricao", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/inscricoes/usuario/curso/${cursoId}`, "GET");

                if (response.error) {
                    throw response
                } else {
                    return response.data[0] || null
                }
            },
            retry: (failureCount, error) => {
                if (error?.code === 498) {
                    return false;
                }

                return failureCount < 3;
            }
        })

    const { mutate: criarInscricao, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/inscricoes`, "POST", { cursoId });

            if (response.error) {
                throw response.errors;
            }
            return response.data;
        },
        onSuccess: () => {
            router.push(`/curso/${cursoId}/player`)
        },
        onError: (error) => {
            toast.error("Erro ao tentar efetuar a inscrição!");
        },
    });


    const inscreverNoCurso = () => {
        if (status === 'unauthenticated') {
            sessionStorage.setItem('redirectPath', `${window.location.pathname}/player`);
            sessionStorage.setItem('inscreverNoCurso', true);
            router.push('/login')
            return
        }

        if (inscricao) {
            router.push(`/curso/${cursoId}/player`)
            return
        }else{
            criarInscricao()
        }

    }

    return (
        <>
            {!isLoadingCurso && !isLoadingInscricao && (
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
                        my-5
                    "
                    >
                        <ButtonLoading
                            onClick={() => { inscreverNoCurso() }}
                            className="w-52 h-12"
                        >
                            {inscricao ? <p className="text-base">Acessar curso</p> : <p className="text-base">Inscreva-se no curso</p>}
                        </ButtonLoading>
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