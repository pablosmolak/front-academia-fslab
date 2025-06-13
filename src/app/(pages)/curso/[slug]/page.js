"use client"

import ButtonLoading from "@/components/buttonLoading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { formatarData } from "@/src/utils/mascaras";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, ChevronDown, Clock, MonitorPlay, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function cursoPage({ params }) {

    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    const router = useRouter();
    const queryClient = useQueryClient();

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
        data: progresso,
        isLoading: isLoadingProgresso,
        isError: isErrorProgresso,
        error: errorProgresso } = useQuery({
            queryKey: ["progresso", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/progressos/curso/${cursoId}`, "GET");

                if (response.error) {
                    throw response
                } else {
                    return response.data[0] || null
                }
            },
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404) {
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

    const {
        data: certificado,
        isLoading: isLoadingCertificado,
        isError: isErrorCertificado,
        error: errorCertificado } = useQuery({
            queryKey: ["certificado", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/certificados/usuario/curso/${cursoId}`, "GET");

                if (response.error) {
                    throw response
                } else {
                    return response.data[0] || null
                }
            },
            retry: (failureCount, error) => {
                if (error?.code === 498 || error?.code === 404) {
                    return false;
                }

                return failureCount < 3;
            }
        })


    const inscreverNoCurso = () => {
        if (status === 'unauthenticated') {
            sessionStorage.setItem('redirectPath', `${window.location.pathname}/player`);
            sessionStorage.setItem('inscreverNoCurso', true);
            router.push('/login')
            return
        }

        if (progresso && !isErrorProgresso) {
            router.push(`/curso/${cursoId}/player`)
            return
        } else {
            criarInscricao()
        }
    }

    const { mutate: desisncreverDoCurso, isLoadingDesinscrever } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/inscricoes/usuario/curso/${cursoId}`, "DELETE");

            if (response.error) {
                throw response.errors;
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Inscrição cancelada com sucesso!");
            queryClient.invalidateQueries(["inscricao", cursoId]);
            queryClient.invalidateQueries(["progresso", cursoId]);
        },
        onError: (error) => {
            toast.error("Erro ao tentar cancelar a inscrição!");
        },
    });


    if (!isLoadingCurso && !isLoadingProgresso) {
        return (
            <>
                <section className="
                    flex flex-col  md:flex-row
                    md:justify-between 
                    items-center 
                    bg-zinc-400  
                    py-8 px-4 xl:px-36 
                    gap-4 xl:gap-4"
                >
                    <h1 className="
                        text-2xl xl:text-3xl 
                        text-center md:text-start
                        font-bold 
                        break-words 
                        whitespace-normal 
                        max-w-[800px]"
                    >
                        {curso?.nomeCurso}
                    </h1>

                    <div className="
                        flex flex-col 
                        bg-white 
                        w-[290px] sm:w-[320px] lg:w-[350px]
                        h-full 
                        rounded-sm 
                        p-5"
                    >
                        {(progresso && !isErrorProgresso) && (
                            <div className="flex items-center gap-4 mb-2">
                                <Progress value={progresso.porcentagem} className="w-[100%]" />
                                <p>{`${progresso?.porcentagem?.toFixed(0) || 0}%`}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-x-8 xl:grid-cols-2 ">
                            <div className="flex items-center gap-2">
                                <CalendarClock />
                                <div>
                                    <p className="text-sm text-gray-500">Carga horária</p>
                                    <p className="text-lg font-medium">{curso?.cargaHoraria}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ">
                                <Users />
                                <div>
                                    <p className="text-sm text-gray-500">Alunos(as)</p>
                                    <p className="text-lg font-medium">{curso?.inscritos}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 xl:col-span-2">
                                <Clock />
                                <div>
                                    <p className="text-sm text-gray-500">Atualizado em</p>
                                    <p className="text-lg font-medium">{formatarData(curso?.ultimaAtualizacao)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="
                    flex start
                    flex-col md:flex-row
                    items-center 
                    bg-zinc-300
                    py-8 px-4 xl:px-36
                    gap-4
                    w-full
                ">
                    <ButtonLoading
                        onClick={() => { inscreverNoCurso() }}
                        className="
                        w-full md:w-52 
                        h-10"
                    >
                        {(progresso && !isErrorProgresso) ? <p className="text-base">Acessar curso</p> : <p className="text-base">Inscreva-se no curso</p>}
                    </ButtonLoading>
                    {(status === 'authenticated') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="
                                rounded-md
                                bg-gray-100 
                                w-full md:w-52 
                                h-10
                                flex
                                items-center
                                justify-center
                                gap-4
                                "

                            >
                                Outras Ações <ChevronDown />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    disabled={(progresso?.porcentagem !== 100 || isErrorProgresso)}
                                    onClick={() => {
                                        if (progresso?.porcentagem === 100) {
                                            router.push(`/usuario/certificado/${certificado?.validador}`)
                                        }
                                    }}
                                >
                                    Certificado
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    disabled={(!progresso || progresso?.porcentagem === 100) || isErrorProgresso}
                                    onClick={() => {
                                        desisncreverDoCurso()
                                    }}
                                >
                                    Cancelar inscrição
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </section >

                <section className="
                    flex flex-col lg:flex-row
                    lg:justify-between 
                    py-8 
                    px-4 xl:px-36
                    w-full
                ">
                    <section className="w-full lg:w-[50%]">
                        <div>
                            <h4 className="
                                font-bold
                                text-2xl
                            ">
                                Descrição
                            </h4>

                            <p className="
                                my-3 
                                text-sm lg:text-base
                                text-justify"
                            >
                                {curso?.descricao}
                            </p>

                        </div>

                        <div>
                            <h4 className="
                                mt-8
                                font-bold
                                text-2xl
                            ">
                                Tópicos
                            </h4>

                            <Accordion type="single" collapsible className="w-full">
                                {curso?.topicos.map((topico) => (
                                    <AccordionItem value={topico.id} key={topico.id}>
                                        <AccordionTrigger>{topico.titulo}</AccordionTrigger>
                                        {topico?.conteudos.map((conteudos) => (
                                            <AccordionContent key={conteudos.id} className='px-4'>
                                                <div className="flex gap-4">
                                                    <MonitorPlay />
                                                    {conteudos.titulo}
                                                </div>
                                            </AccordionContent>
                                        ))}

                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </section>

                    <section className="
                        w-full lg:w-[50%]
                        mt-8 lg:mt-0
                        lg:pl-[20%]
                    "
                    >

                        <h4 className="
                            font-bold
                            text-2xl
                        ">
                            {curso?.instrutores?.length > 1 ? 'Instrutores' : 'Instrutor(a)'}
                        </h4>

                        <div className="flex-1 mt-4">
                            {curso?.instrutores?.map(instrutor => (
                                <div
                                    key={instrutor.id}
                                    className="flex items-center gap-2">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={handleImagePath(`/usuarios/${instrutor.id}/image`)} />
                                        <AvatarFallback>{instrutor.nome.trim().slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <p>{instrutor.nome}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>
            </>
        )
    }

    if (isLoadingCurso || isLoadingProgresso) {
        return (
            <>
                {/* Cabeçalho com título e painel de progresso/detalhes */}
                <section className="
                    flex flex-col md:flex-row
                    md:justify-between 
                    items-center 
                    bg-zinc-400  
                    py-8 px-4 xl:px-36 
                    gap-4 xl:gap-4"
                >
                    <Skeleton className="h-8 xl:h-10 w-full md:max-w-[800px]" />

                    <div className="
                        flex flex-col 
                        bg-white 
                        w-[290px] sm:w-[320px] lg:w-[350px]
                        h-full 
                        rounded-sm 
                        p-5 space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-x-8 xl:grid-cols-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <CalendarClock className="w-6 h-6 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Carga horária</p>
                                    <Skeleton className="w-16 h-5" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 min-w-0">
                                <Users className="w-6 h-6 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Alunos(as)</p>
                                    <Skeleton className="w-16 h-5" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 xl:col-span-2 min-w-0">
                                <Clock className="w-6 h-6 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Atualizado em</p>
                                    <Skeleton className="w-16 h-5" />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="
                    flex start
                    flex-col md:flex-row 
                    items-center 
                    bg-zinc-300
                    py-8 px-4 xl:px-36
                    gap-4
                    w-full
                 ">
                    <Skeleton className="w-full md:w-52 h-10" />
                    <Skeleton className="w-full md:w-52 h-10" />
                </section>

                <section className="
                    flex flex-col lg:flex-row
                    lg:justify-between 
                    py-8 
                    px-4 xl:px-36
                    w-full
                ">
                    <section className="w-full lg:w-[50%] space-y-6">
                        <div>
                            <h4 className="font-bold text-2xl">Descrição</h4>
                            <div className="mt-3 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>

                        <div>
                            <h4 className="mt-8 font-bold text-2xl">Tópicos</h4>
                            <div className="space-y-4 mt-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <div className="space-y-2 pl-4">
                                            <Skeleton className="h-4 w-2/3" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Instrutores */}
                    <section className="w-full lg:w-[50%] mt-8 lg:mt-0 lg:pl-[20%] space-y-4">
                        <h4 className="font-bold text-2xl">Instrutor(a)</h4>
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        ))}
                    </section>
                </section>
            </>

        )
    }
}