"use client"

import { Badge } from "@/components/ui/badge";
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
import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { NavUser } from "./nav-user";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"



export function AppSidebar({ onVideoChange, cursoId, progresso }) {
    // const router = useRouter();

    // const {
    //     data: curso,
    //     isLoading,
    //     isError,
    //     error } = useQuery({
    //         queryKey: ["getCursosPlayer"],
    //         queryFn: async () => {
    //             const response = await fetchApi(`/cursos/publicados/${cursoId}`, "GET");

    //             if (response.error) {
    //                 throw response.errors;
    //             } else {
    //                 return response.data[0]
    //             }
    //         }
    //     })


    // const [topicoSelecionado, setTopicoSelecionado] = useState(null);
    // useEffect(() => {
    //     if (curso?.topicos && progresso?.atividadeAtual) {
    //         const topicoEncontrado = curso.topicos.find((topico) =>
    //             topico.conteudos?.some((conteudo) => conteudo.id === progresso.atividadeAtual)
    //         );
    //         setTopicoSelecionado(topicoEncontrado?.titulo || null)
    //     } else if (curso?.topicos) {
    //         setTopicoSelecionado(curso?.topicos[0]?.conteudos[0]?.titulo)
    //     }

    // }, [curso, progresso]);

    // const conteudosFiltrados = curso?.topicos?.find(
    //     (topico) => topico.titulo === topicoSelecionado
    // )?.conteudos;


    // const [activeContentId, setActiveContentId] = useState(null);

    // const handleContentClick = (conteudo) => {
    //     if (onVideoChange) {
    //         setActiveContentId(conteudo.id);
    //         onVideoChange(conteudo);
    //     }
    // };

    // const atividadeAtual = curso?.topicos
    //     .flatMap((topico) => topico.conteudos)
    //     .find((conteudo) => conteudo.id === progresso?.atividadeAtual);

    // useEffect(() => {
    //     if (atividadeAtual) {
    //         handleContentClick(atividadeAtual);
    //     }
    // }, [atividadeAtual]);


    const router = useRouter();
    const [topicoSelecionado, setTopicoSelecionado] = useState(null);
    const [activeContentId, setActiveContentId] = useState(null);

    // Query para buscar o curso
    const {
        data: curso,
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ["getCursosPlayer", cursoId],
            queryFn: async () => {
                const response = await fetchApi(`/cursos/publicados/${cursoId}`, "GET");
                if (response.error) {
                    throw response.errors;
                }
                return response.data[0];
            }
        });

    useEffect(() => {
        if (curso?.topicos) {
            const topicoAtual = progresso?.atividadeAtual
                ? curso.topicos.find((topico) =>
                    topico.conteudos?.some((conteudo) => conteudo.id === progresso.atividadeAtual)
                )
                : curso.topicos[0];

            setTopicoSelecionado(topicoAtual?.titulo || null);
        }
    }, [curso, progresso]);

    const conteudosFiltrados = curso?.topicos?.find(
        (topico) => topico.titulo === topicoSelecionado
    )?.conteudos;

    const handleContentClick = (conteudo) => {
        setActiveContentId(conteudo.id);
        if (onVideoChange) onVideoChange(conteudo);
    };

    // Identifica a atividade atual e seleciona automaticamente
    useEffect(() => {
        if (curso?.topicos && progresso?.atividadeAtual) {
            const atividadeAtual = curso.topicos
                .flatMap((topico) => topico.conteudos)
                .find((conteudo) => conteudo.id === progresso.atividadeAtual);

            if (atividadeAtual) {
                handleContentClick(atividadeAtual);
            }
        }else if(curso?.topicos){
            handleContentClick(curso?.topicos[0]?.conteudos[0])
        }
    }, [curso, progresso]);

    return (
        <Sidebar className="border-none">
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
                    <Badge>{`${progresso?.porcentagem?.toFixed(0) || 0}%`}</Badge>
                    <Progress value={(progresso?.porcentagem || 0)} />
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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <SidebarMenuItem key={conteudo.id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    onClick={() => handleContentClick(conteudo)}
                                                    isActive={activeContentId === conteudo.id}
                                                >
                                                    <div>
                                                        <MonitorPlay
                                                            className={progresso?.atividadesConcluidas?.includes(conteudo.id)
                                                                ? "text-lime-400" : ""}
                                                        />
                                                        <span>
                                                            {conteudo.titulo}
                                                        </span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </TooltipTrigger>
                                        <TooltipContent className>
                                            {conteudo.titulo}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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