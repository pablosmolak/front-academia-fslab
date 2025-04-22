"use client";

import { usuarioSchema } from "@/src/schemas/usuarioSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import InputFoto from "./inputFoto";
import { Input } from "../ui/input";
import ButtonLoading from "../buttonLoading";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { ApplicationContext } from "@/src/context/applicationContext";
import { set } from "zod";
import { getUserInfos } from "@/src/actions/authAction";
import { handleImagePath } from "@/src/utils/handleImagePath";

export default function EditarPerfilDialog({ usuario }) {

    const [open, setOpen] = useState(false);
    const { setUser } = useContext(ApplicationContext);

    const schemaAtualizarPerfil = usuarioSchema.alterarUsuario
    const formAtualizarPerfil = useForm({
        resolver: zodResolver(schemaAtualizarPerfil),
        defaultValues: {
            email: usuario?.email || "",
            nome: usuario?.nome || "",
            foto: usuario?.fotoPerfil,
            senha: "",
            confirmaSenha: ""
        }
    });

    async function atualizarPerfil(data) {

        const response = await fetchApi(`/usuarios/${usuario.id}`, "PATCH", {
            nome: data.nome,
            email: data.email
        })

        if (response.error) {
            if (response.code === 422) {
                toast.error("Erro ao atualizar o usuário, verifique o formulário!")
            }

            console.log(response.errors)
            handleFormErrors(response.errors, formAtualizarPerfil);

        } else {
            setUser({
                ... await getUserInfos(),
                fotoPerfilUrl: handleImagePath(`/usuarios/${usuario?.id}/image?time=${Date.now()}`)
            })

            toast.success("Usuário atualizado com sucesso!");
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-32" size="sm">
                    Editar Perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para editar seu perfil.
                    </DialogDescription>
                </DialogHeader>

                <Form {...formAtualizarPerfil}>
                    <form
                        className="space-y-2"
                        id="form-atualizar-perfil"
                        onSubmit={formAtualizarPerfil.handleSubmit(atualizarPerfil)}
                    >
                        <FormField
                            control={formAtualizarPerfil.control}
                            name="foto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputFoto
                                            id={"foto"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            data-test="fotoItem"
                                            usuario={usuario}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formAtualizarPerfil.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="nome">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="nome"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <FormField
                            control={formAtualizarPerfil.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Ao alterar, é necessário confirmar o e-mail.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <FormField
                            control={formAtualizarPerfil.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="senha">Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="senha"
                                            type="password"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <FormField
                            control={formAtualizarPerfil.control}
                            name="confirmaSenha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="confirmaSenha">Confirmar Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="confirmaSenha"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <div className="pt-4">
                            <ButtonLoading className={"w-full"}>
                                Atualizar
                            </ButtonLoading>

                        </div>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}