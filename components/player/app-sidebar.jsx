"use client"

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Progress } from "../ui/progress";
import { ArrowLeft, MonitorPlay } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { NavUser } from "./nav-user";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";


const progresso = {
    "userId": "28c57d8e-5712-41fe-9c9b-f74c26298f13",
    "cursoId": "022dbbfa-8e29-469a-a478-6e7d3caf8801",
    "porcentagem": 33.33333333333333,
    "atividadeAtual": "4e00cd71-f105-4889-9030-a4856cc20994",
    "atividadesConcluidas": [
        "c776b8ec-34d5-47ff-9c61-5b84fab3f889",
        "3b2532a1-6b7e-41df-941e-39845630e933"
    ],
    "created_at": "2025-01-09T12:58:17.832Z",
    "updated_at": "2025-01-09T13:09:12.704Z"
}

const curso = {
    "id": "022dbbfa-8e29-469a-a478-6e7d3caf8801",
    "nome": "Desenvolvimento com React",
    "descricao": "Voluptate nesciunt et. Et eos deserunt. Reiciendis aperiam id. Et occaecati eligendi eveniet libero assumenda sed aut. Dolores rerum aliquid voluptatem sapiente est ab provident officia. Omnis ullam ut.\n \rOfficiis veritatis qui repudiandae. Labore rem nulla id minus id. Sit nulla aspernatur quasi dolorem ullam veritatis velit. Sit possimus maxime.",
    "capa": "1390213d-6f59-49d6-9f03-d6a22e7b87e3.jpg",
    "criador": "2d3b9f68-9aaa-4f36-8b5a-6852ade290a8",
    "created_at": "2025-01-09T12:47:38.767Z",
    "updated_at": "2025-01-09T12:47:38.767Z",
    "topicos": [
        {
            "id": "795fb2f8-db5c-4e41-b5c2-a8b29d6db433",
            "titulo": "Introdução à Programação",
            "ordem": 1,
            "cursoId": "022dbbfa-8e29-469a-a478-6e7d3caf8801",
            "created_at": "2025-01-09T12:53:18.597Z",
            "updated_at": "2025-01-09T12:53:18.597Z",
            "conteudos": [
                {
                    "id": "c776b8ec-34d5-47ff-9c61-5b84fab3f889",
                    "titulo": "Aula 1 - Introdução à Programação",
                    "topicoId": "795fb2f8-db5c-4e41-b5c2-a8b29d6db433",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/9d7qAMDLi_w?si=5ZqmUY11n0LCJr-4&amp;controls=0",
                    "cargaHoraria": "00:18:00",
                    "ordem": 1,
                    "created_at": "2025-01-09T12:53:58.768Z",
                    "updated_at": "2025-01-09T12:53:58.768Z"
                },
                {
                    "id": "3b2532a1-6b7e-41df-941e-39845630e933",
                    "titulo": "Aula 2 - Introdução à Programação",
                    "topicoId": "795fb2f8-db5c-4e41-b5c2-a8b29d6db433",
                    "tipo": "Youtube URL",
                    "conteudo": "https://youtu.be/9u1uG905l-w",
                    "cargaHoraria": "00:18:00",
                    "ordem": 2,
                    "created_at": "2025-01-09T12:53:59.674Z",
                    "updated_at": "2025-01-09T12:53:59.674Z"
                },
                {
                    "id": "4e00cd71-f105-4889-9030-a4856cc20994",
                    "titulo": "Aula 3 - Introdução à Programação",
                    "topicoId": "795fb2f8-db5c-4e41-b5c2-a8b29d6db433",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/9d7qAMDLi_w?si=5ZqmUY11n0LCJr-4&amp;controls=0",
                    "cargaHoraria": "00:18:00",
                    "ordem": 3,
                    "created_at": "2025-01-09T12:54:00.575Z",
                    "updated_at": "2025-01-09T12:54:00.575Z"
                }
            ]
        },
        {
            "id": "6c447d08-a076-470e-84a4-9e464a918ef5",
            "titulo": "Introdução à Programação 1",
            "ordem": 2,
            "cursoId": "022dbbfa-8e29-469a-a478-6e7d3caf8801",
            "created_at": "2025-01-09T12:53:31.214Z",
            "updated_at": "2025-01-09T12:53:31.214Z",
            "conteudos": [
                {
                    "id": "3c33946f-f581-4d76-ab10-d9800de49fc3",
                    "titulo": "Aula 1.1 - Introdução à Programação 1",
                    "topicoId": "6c447d08-a076-470e-84a4-9e464a918ef5",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/9d7qAMDLi_w?si=5ZqmUY11n0LCJr-4&amp;controls=0",
                    "cargaHoraria": "00:18:00",
                    "ordem": 1,
                    "created_at": "2025-01-09T12:53:48.630Z",
                    "updated_at": "2025-01-09T12:53:48.630Z"
                },
                {
                    "id": "51ec2952-1e4e-41db-9c1c-efb9584bcc3e",
                    "titulo": "Aula 1.2 - Introdução à Programação 1",
                    "topicoId": "6c447d08-a076-470e-84a4-9e464a918ef5",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/9d7qAMDLi_w?si=5ZqmUY11n0LCJr-4&amp;controls=0",
                    "cargaHoraria": "00:18:00",
                    "ordem": 2,
                    "created_at": "2025-01-09T12:53:50.130Z",
                    "updated_at": "2025-01-09T12:53:50.130Z"
                },
                {
                    "id": "2ffe36d0-413c-4e00-ad14-7e415cb2268f",
                    "titulo": "Aula 1.3 - Introdução à Programação 1",
                    "topicoId": "6c447d08-a076-470e-84a4-9e464a918ef5",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/9d7qAMDLi_w?si=5ZqmUY11n0LCJr-4&amp;controls=0",
                    "cargaHoraria": "00:18:00",
                    "ordem": 3,
                    "created_at": "2025-01-09T12:53:52.893Z",
                    "updated_at": "2025-01-09T12:53:52.893Z"
                }
            ]
        }
    ]
}

export function AppSidebar({ onVideoChange }) {
    const router = useRouter();

    const [topicoSelecionado, setTopicoSelecionado] = useState(
        curso?.topicos?.find((topico) => topico.select)?.nome || curso?.topicos[0]?.titulo
    );

    const conteudosFiltrados = curso?.topicos?.find(
        (topico) => topico.titulo === topicoSelecionado
    )?.conteudos;


    const handleContentClick = (conteudo) => {
        if (onVideoChange) {
            onVideoChange(conteudo);
        }
    };

    const atividadeAtual = curso.topicos
        .flatMap((topico) => topico.conteudos)
        .find((conteudo) => conteudo.id === progresso.atividadeAtual);

    console.log(atividadeAtual)

    useEffect(() => {
        if (atividadeAtual) {
            handleContentClick(atividadeAtual);
        }
    }, []);

    return (
        <Sidebar>
            <SidebarHeader className='flex flex-col items-center'>
                <SidebarGroup className='flex flex-row items-center gap-2'>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className='size-6'
                        onClick={() => {
                            router.push(`/curso/${curso.id}`)
                        }}
                    >
                        <ArrowLeft
                            className="size-4"
                        />
                    </Button>
                    <h3
                    className="text-sm"
                    >{curso.nome}</h3>

                </SidebarGroup>
                <SidebarGroup className='flex flex-row items-center gap-2'>
                    <Badge>{`${progresso?.porcentagem.toFixed(0)}%`}</Badge>
                    <Progress value={progresso.porcentagem} />
                </SidebarGroup>
            </SidebarHeader>
            <Separator
            className="bg-zinc-700"
            />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Tópico Atual</SidebarGroupLabel>
                        <Select
                            value={topicoSelecionado}
                            onValueChange={(value) => setTopicoSelecionado(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um tópico" />
                            </SelectTrigger>
                            <SelectContent>
                                {curso?.topicos?.map((item) => (
                                    <SelectItem key={item.id} value={item.titulo}>
                                        {item.titulo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Conteúdos</SidebarGroupLabel>
                        <SidebarMenu>
                            {conteudosFiltrados?.map((conteudo) => (
                                <SidebarMenuItem key={conteudo.id}>
                                    <SidebarMenuButton
                                        asChild
                                        onClick={() => handleContentClick(conteudo)}
                                    >
                                        <div>
                                            <MonitorPlay
                                                className={progresso?.atividadesConcluidas.includes(conteudo.id)
                                                    ? "text-lime-400" : ""}
                                            />
                                            <span>{conteudo.titulo}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}