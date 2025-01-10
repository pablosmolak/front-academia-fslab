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
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/src/utils/fetchApi";


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

export function AppSidebar({ onVideoChange, cursoId }) {
    const router = useRouter();

    const {
        data: curso,
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ["getCursosPlayer"],
            queryFn: async () => {
                const response = await fetchApi(`/cursos/${cursoId}`, "GET");

                if (response.error) {
                    throw response.errors;
                } else {
                    return response.data[0]
                }
            }
        })

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

    const atividadeAtual = curso?.topicos
        .flatMap((topico) => topico.conteudos)
        .find((conteudo) => conteudo.id === progresso.atividadeAtual);

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
                    >{curso?.nome}</h3>

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