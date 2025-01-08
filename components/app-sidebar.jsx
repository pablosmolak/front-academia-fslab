"use client"

import { useState } from "react";
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
import { Progress } from "./ui/progress";
import { MonitorPlay } from "lucide-react";
import { Badge } from "@/components/ui/badge"

const porcentagemConcluida = 100;

const topicos = [
    {
        nome: "Python",
        select: false,
        conteudos: [
            { title: "Introdução ao Python", url: "https://www.youtube.com/embed/1Lfv5tUGsn8", icon: MonitorPlay },
            { title: "Estruturas de Controle em Python", url: "https://www.youtube.com/embed/2Lh1ag2lkKw", icon: MonitorPlay },
            { title: "Trabalhando com Listas e Dicionários", url: "https://www.youtube.com/embed/3Lh4w9QdsXy", icon: MonitorPlay },
            // Outros conteúdos...
        ],
    },
    {
        nome: "JavaScript",
        select: true,
        conteudos: [
            { title: "Fundamentos do JavaScript", url: "https://www.youtube.com/embed/4JsLh5FySlY", icon: MonitorPlay },
            { title: "Manipulação do DOM", url: "https://www.youtube.com/embed/5JsDwf4kFnY", icon: MonitorPlay },
            // Outros conteúdos...
        ],
    },
    // Outros tópicos...
];

export function AppSidebar({ onVideoChange }) {
    const [topicoSelecionado, setTopicoSelecionado] = useState(
        topicos.find((topico) => topico.select)?.nome || topicos[0].nome
    );

    const conteudosFiltrados = topicos.find(
        (topico) => topico.nome === topicoSelecionado
    )?.conteudos;

    const handleContentClick = (conteudo) => {
        if (onVideoChange) {
            onVideoChange(conteudo.url);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className='flex flex-row items-center'>
                <Badge>{`${porcentagemConcluida}%`}</Badge>
                <Progress value={porcentagemConcluida} />
            </SidebarHeader>
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
                                {topicos.map((item) => (
                                    <SelectItem key={item.nome} value={item.nome}>
                                        {item.nome}
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
                                <SidebarMenuItem key={conteudo.title}>
                                    <SidebarMenuButton
                                        asChild
                                        onClick={() => handleContentClick(conteudo)}

                                    >
                                        <a href="#!">
                                            <conteudo.icon />
                                            <span>{conteudo.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
