"use client"

import ButtonLoading from "@/components/buttonLoading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { formatarData } from "@/src/utils/mascaras";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarClock, Clock, MonitorPlay, Users } from "lucide-react";
import { useSession } from "next-auth/react";
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

        if (progresso) {
            router.push(`/curso/${cursoId}/player`)
            return
        } else {
            criarInscricao()
        }

    }

    return (
        !isLoadingCurso && !isLoadingProgresso && (
            <>
                <section className="
                    flex flex-col  md:flex-row
                    md:justify-between 
                    items-center 
                    bg-zinc-400  
                    py-8 px-4 xl:px-36 
                    gap-4 xl:gap-4"
                >

                    {console.log(curso)}
                    <h1 className="text-2xl xl:text-3xl 
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
                        {progresso &&(
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
                    flex justify-between 
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
                        {progresso ? <p className="text-base">Acessar curso</p> : <p className="text-base">Inscreva-se no curso</p>}
                    </ButtonLoading>
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
                                            <AccordionContent className='px-4'>
                                                <div className="flex gap-4">
                                                    <MonitorPlay/>
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
    );
}

    // return (
    //     <>
    //         {!isLoadingCurso && !isLoadingInscricao && (
    //             <div>
    //                 <div>
    //                     <h1 className="text-2xl font-bold">
    //                         {curso.nomeCurso}
    //                     </h1>

    //                     <p className="my-3 text-justify">
    //                         {curso.descricao}
    //                     </p>
    //                 </div>

    //                 <div className="
    //                     flex
    //                     justify-center 
    //                     my-5
    //                 "
    //                 >
    //                     <ButtonLoading
    //                         onClick={() => { inscreverNoCurso() }}
    //                         className="w-52 h-12"
    //                     >
    //                         {inscricao ? <p className="text-base">Acessar curso</p> : <p className="text-base">Inscreva-se no curso</p>}
    //                     </ButtonLoading>
    //                 </div>


    //                 <div className={`flex ${curso.categorias?.length <= 3 && curso.instrutores?.length <= 3 ? 'flex-row items-start' : 'flex-col mt-4'}`}>
    //                     <div className="flex-1">
    //                         <h2 className="font-bold text-lg text-start my-2">Tópicos abordados:</h2>
    //                         <ul
    //                             className={`list-disc pl-5 grid gap-4 ${curso.categorias?.length > 3 ? 'grid-cols-3' : ''} `}
    //                         >
    //                             {curso.categorias?.map(categoria => (
    //                                 <li key={categoria}>{categoria}</li>
    //                             ))}
    //                         </ul>
    //                     </div>


    //     <div className="flex-1 mt-4 sm:mt-0">
    //         <h2 className="font-bold text-lg text-start my-2">{curso.instrutores?.length > 1 ? 'Instrutores:' : 'Instrutor:'}</h2>
    //         <div
    //             className={`grid gap-4 ${curso.instrutores?.length > 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
    //         >
    //             {curso.instrutores?.map(instrutor => (
    //                 <Link
    //                     key={instrutor.id}
    //                     href={`http://localhost:3100/usuarios/${instrutor.id}`}
    //                 >
    //                     <Card className="w-40 flex-shrink-0">
    //                         <CardHeader>
    //                             <Avatar className="h-28 w-28">
    //                                 <AvatarImage src={handleImagePath(`/usuarios/${instrutor.id}/image`)} />
    //                                 <AvatarFallback>{instrutor.nome.trim().slice(0, 2).toUpperCase()}</AvatarFallback>
    //                             </Avatar>
    //                         </CardHeader>
    //                         <CardFooter>
    //                             <p>{instrutor.nome}</p>
    //                         </CardFooter>
    //                     </Card>
    //                 </Link>
    //             ))}
    //         </div>
    //     </div>
    // </div>
    //             </div>
    //         )} 
    //     </>
    // )
