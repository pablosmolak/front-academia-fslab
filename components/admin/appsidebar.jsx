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
import { ArrowLeft, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
// import { PlayerCertificadoAlert } from "./player-certificado";

export function AppSidebar({ onVideoChange, curso, progresso, conteudoSelecionado, certificado }) {

    const data = {
        navMain: [
            {
                title: "Menus",
                url: "#",
                items: [
                    {
                        title: "Cursos",
                        url: "/admin/cursos",
                    },
                    {
                        title: "Usuários",
                        url: "/admin/usuarios",
                    },
                ],
            }
        ],
    }

    const router = useRouter();
   
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
                            router.push(`/`)
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
            </SidebarHeader>
            <Separator
                className="bg-zinc-700"
            />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        {data.navMain.map((item) => (
                            <SidebarGroup key={item.title}>
                                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {item.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={item.isActive}>
                                                    <a href={item.url}>{item.title}</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* <SidebarGroup>
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
                </SidebarGroup> */}
            </SidebarContent>
        </Sidebar>
    );
}