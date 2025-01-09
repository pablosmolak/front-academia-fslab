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

const porcentagemConcluida = 83;

const curso = {
    "id": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
    "nome": "Administração de Sistemas Linux",
    "descricao": "Officiis assumenda perspiciatis quisquam non nisi omnis eum. Dignissimos voluptas consequatur voluptatem possimus reiciendis sed ut voluptatibus voluptatem. Rem dolorem et exercitationem hic occaecati molestias.\n \rModi quia hic sed porro ducimus consectetur aut esse. Unde quaerat aperiam velit velit. Explicabo molestiae officia nobis laudantium aut.",
    "capa": "59823809-80b0-4f1b-a7bc-ec8bda2e1203.jpg",
    "criador": "b6cca259-4ad3-4132-be35-3aa83456bbc2",
    "created_at": "2024-12-30T23:21:04.761Z",
    "updated_at": "2024-12-30T23:21:04.761Z",
    "topicos": [
        {
            "id": "beebff0a-70ff-4ca4-b30b-ec3335c6acef",
            "titulo": "Introdução à Programação",
            "ordem": 1,
            "cursoId": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
            "created_at": "2025-01-09T02:20:24.830Z",
            "updated_at": "2025-01-09T02:20:24.830Z",
            "conteudos": [
                {
                    "id": "bef718f6-ca06-45c6-8eab-e4bd10eb64f7",
                    "topicoId": "c7f9491b-0eb4-44ec-9f7c-72f70db2ea59",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/nok79GIXAoQ?si=HLOnRbyy0iGJfTjq",
                    "cargaHoraria": "00:18:00",
                    "ordem": 1,
                    "created_at": "2025-01-09T02:21:36.816Z",
                    "updated_at": "2025-01-09T02:21:36.816Z"
                },
                {
                    "id": "bef718f6-ca06-45c6-8eab-e4bd10eb64f7",
                    "topicoId": "c7f9491b-0eb4-44ec-9f7c-72f70db2ea59",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/nok79GIXAoQ?si=HLOnRbyy0iGJfTjq",
                    "cargaHoraria": "00:18:00",
                    "ordem": 1,
                    "created_at": "2025-01-09T02:21:36.816Z",
                    "updated_at": "2025-01-09T02:21:36.816Z"
                }
            ]
        },
        {
            "id": "999fb93e-d23f-44c2-9c36-d32b01ed3d87",
            "titulo": "Introdução à Programação 1",
            "ordem": 2,
            "cursoId": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
            "created_at": "2025-01-09T02:20:32.045Z",
            "updated_at": "2025-01-09T02:20:32.045Z",
            "conteudos": []
        },
        {
            "id": "dbaed3c0-7123-48cc-b952-f034704b4f80",
            "titulo": "Introdução à Programação 2",
            "ordem": 3,
            "cursoId": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
            "created_at": "2025-01-09T02:20:37.099Z",
            "updated_at": "2025-01-09T02:20:37.099Z",
            "conteudos": []
        },
        {
            "id": "5b6ba28a-9c25-47d7-8c4c-75d05814a591",
            "titulo": "Introdução à Programação 3",
            "ordem": 4,
            "cursoId": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
            "created_at": "2025-01-09T02:20:40.833Z",
            "updated_at": "2025-01-09T02:20:40.833Z",
            "conteudos": []
        },
        {
            "id": "c7f9491b-0eb4-44ec-9f7c-72f70db2ea59",
            "titulo": "Introdução à Programação 4",
            "ordem": 5,
            "cursoId": "11e04996-7a8e-4e15-8b1f-971fac0710e0",
            "created_at": "2025-01-09T02:20:44.564Z",
            "updated_at": "2025-01-09T02:20:44.564Z",
            "conteudos": [
                {
                    "id": "bef718f6-ca06-45c6-8eab-e4bd10eb64f7",
                    "topicoId": "c7f9491b-0eb4-44ec-9f7c-72f70db2ea59",
                    "tipo": "Youtube URL",
                    "conteudo": "https://www.youtube.com/embed/nok79GIXAoQ?si=HLOnRbyy0iGJfTjq",
                    "cargaHoraria": "00:18:00",
                    "ordem": 1,
                    "created_at": "2025-01-09T02:21:36.816Z",
                    "updated_at": "2025-01-09T02:21:36.816Z"
                }
            ]
        }
    ],
    "categoria": [
        {
            "id": "0c3f0471-4691-4293-b7f1-abddf4f69d41",
            "nome": "Desenvolvimento Web",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "109237de-8b4e-4d24-a77d-17e8ba1e5df7",
            "nome": "Data Science",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "14d7ccd9-908d-400f-9542-a951c1c55e44",
            "nome": "Desenvolvimento de Software",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "18de2165-e9da-45fa-a48b-17618fd9c1cc",
            "nome": "Banco de Dados",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "31304b76-c735-495b-8886-7cf30d9cd1a5",
            "nome": "Programação em Python",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "3580c005-633e-4d21-8062-89ce635fad20",
            "nome": "Cloud Computing",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "3f72f861-c990-48d0-8bec-5e37725ce4bb",
            "nome": "AWS",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "66d144b1-b8c2-4dc1-abd3-2cabe9fbdf1f",
            "nome": "Blockchain",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "70135252-8374-43cb-8cd1-fcebfafdbf44",
            "nome": "Python para Dados",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "7570b9bc-9527-4a81-becd-ef1f90e5134c",
            "nome": "Testes de Software",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "77627cb3-f9c1-4537-8ac5-5e61418f8e23",
            "nome": "Inteligência Artificial",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "b74927b2-c2b4-41bc-b0df-532abeebeb65",
            "nome": "Big Data",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "c4071cc3-83d2-4d26-a555-29cfc3634930",
            "nome": "Realidade Virtual",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "c6027c22-1b0f-48a4-9915-a9e8be712a17",
            "nome": "IoT",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "d0c2f829-9762-498b-a479-2d1c435166c5",
            "nome": "Realidade Aumentada",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "d394fc19-ede0-4756-8ff2-5e95189cb60c",
            "nome": "Engenharia de Software",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "db026511-164a-48f0-ad95-31e8f9fe9872",
            "nome": "RPA",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "eba34069-9d28-4e5a-9891-f8bf3fcacfc5",
            "nome": "Design de UX/UI",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "f0845db4-2f55-4ebd-8176-7fb9b50e8537",
            "nome": "DevOps",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        },
        {
            "id": "f4c22103-bf7e-4ca1-b398-977fe8198f5f",
            "nome": "Azure",
            "created_at": "2024-12-30T23:21:04.643Z",
            "updated_at": "2024-12-30T23:21:04.643Z"
        }
    ]
}

export function AppSidebar({ onVideoChange }) {
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
                                        onClick={() => handleContentClick(conteudo.conteudo)}
                                    >
                                        <a href="#!">
                                            <MonitorPlay className="text-lime-400" />
                                            <span>{conteudo.conteudo}</span>
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
