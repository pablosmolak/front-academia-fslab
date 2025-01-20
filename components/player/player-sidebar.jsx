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
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { ArrowLeft, FileBadge, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { PlayerCertificadoAlert } from "./player-certificado";

export function AppSidebar({ onVideoChange, curso, progresso, conteudoSelecionado }) {

    const router = useRouter();
    const [topicoSelecionado, setTopicoSelecionado] = useState(null);

    useEffect(() => {
        if (curso?.topicos) {
            const topicoAtual = progresso?.atividadeAtual
                ? curso.topicos.find((topico) =>
                    topico.conteudos?.some((conteudo) => conteudo.id === progresso.atividadeAtual)
                )
                : curso.topicos[0];

            const conteudoAtual = progresso?.atividadeAtual
                ? curso.topicos
                    .flatMap((topico) => topico.conteudos)
                    .find((conteudo) => conteudo.id === progresso.atividadeAtual)
                : curso.topicos[0]?.conteudos[0];

            setTopicoSelecionado(topicoAtual?.titulo || null);
            handleContentClick(conteudoAtual);
        }

    }, [curso]);

    useEffect(() => {
        const topicoAtual = curso?.topicos?.find((topico) =>
            topico.conteudos?.some((conteudo) => conteudo.id === conteudoSelecionado?.id)
        )

        setTopicoSelecionado(topicoAtual?.titulo || null);
    }, [conteudoSelecionado])

    const conteudosFiltrados = curso?.topicos?.find(
        (topico) => topico.titulo === topicoSelecionado
    )?.conteudos;

    const handleContentClick = (conteudo) => {
        if (onVideoChange) onVideoChange(conteudo);
    };

    const formatarCargaHoraria = (cargaHoraria) => {
        const [horas, minutos, segundos] = cargaHoraria.split(":").map(Number);

        const partes = [];
        if (horas > 0) {
            partes.push(`${horas}h`);
        }
        if (minutos > 0) {
            partes.push(`${minutos}m`);
        }
        if (horas === 0 && minutos === 0 && segundos > 0) {
            partes.push(`${segundos}s`);
        }

        return partes.join(":");
    }

    return (
        <Sidebar className="border-none mt-16 h-[calc(100vh-4rem)]" >
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
                            <SelectContent
                                className="bg-zinc-800 text-gray-100 border-zinc-500 "
                            >
                                {curso?.topicos?.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.titulo}
                                        className="focus:bg-zinc-700 focus:text-gray-100"
                                    >
                                        {`${String(item.ordem).padStart(2, "0")} - ${item.titulo}`}
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
                                        size="Slg"
                                        asChild
                                        onClick={() => handleContentClick(conteudo)}
                                        isActive={conteudoSelecionado?.id === conteudo?.id}
                                    >


                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <MonitorPlay
                                                        className={`${progresso?.atividadesConcluidas?.includes(conteudo.id) ? "text-lime-400" : ""
                                                            } size-6`}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-gray-400 ml-1 text-xs"> {String(conteudo.ordem).padStart(2, "0")}</span>
                                                    <span> {conteudo.titulo}</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-600 px-2 py-1 rounded text-xs">
                                                {formatarCargaHoraria(conteudo.cargaHoraria)}
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
               <PlayerCertificadoAlert/>
            </SidebarFooter>
        </Sidebar>
    );
}