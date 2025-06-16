"use client";

import { getUserInfos } from "@/src/actions/authAction";
import { ApplicationContext } from "@/src/context/applicationContext";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { usuarioSchema } from "@/src/schemas/usuarioSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ButtonLoading from "../buttonLoading";
import InputPassword from "../inputPassword";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import InputFoto from "./inputFoto";

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
            alterarSenha: false,
            senha: "",
            confirmaSenha: ""
        }
    });

    const { mutate: atualizarPerfil, isLoading: isLoadingCriarInscricao } = useMutation({
        mutationFn: async (data) => {
            const response = await fetchApi(`/usuarios/${usuario.id}`, "PATCH", {
                nome: data.nome,
                email: data.email,
                ...(data.alterarSenha && data.senha && { senha: data.senha })
            })

            if (response.error) {
                throw response;
            }

            return response.data;
        },
        onSuccess: async () => {
            setUser({
                ... await getUserInfos(),
                fotoPerfilUrl: handleImagePath(`/usuarios/${usuario?.id}/image?time=${Date.now()}`)
            })

            toast.success("Usuário atualizado com sucesso!");
            setOpen(false);
        },
        onError: (error) => {
            if (error.code === 422) {
                toast.error("Erro ao atualizar o usuário, verifique o formulário!")
            }

            handleFormErrors(error.errors, formAtualizarPerfil);
        },
    });

    const { mutate: excluirConta, isLoading: isLoadingExcluirConta } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/usuarios/${usuario.id}`, "DELETE");

            if (response.error) {
                throw response;
            }

            return response.message
        },
        onSuccess: async () => {
            toast.success("Conta excluída com sucesso!");

            signOut();
        },
        onError: (error) => {
            if (error.code === 422) {
                toast.error("Erro ao deletar o usuário, tente novamente!")
            }

            handleFormErrors(error.errors, formAtualizarPerfil);
        }
    });

    useEffect(() => {
        const subscription = formAtualizarPerfil.watch((value, { name }) => {
            if (name === "alterarSenha" && value.alterarSenha === false) {
                formAtualizarPerfil.setValue("senha", "");
                formAtualizarPerfil.setValue("confirmaSenha", "");
            }
        });

        return () => subscription.unsubscribe();
    }, [formAtualizarPerfil.watch, formAtualizarPerfil.setValue]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-32" size="sm">
                    Editar Perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md overflow-y-auto max-h-full">
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
                                    <FormLabel htmlFor="nome">Nome <span className="text-red-500">*</span></FormLabel>
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
                                    <FormLabel htmlFor="email">E-mail <span className="text-red-500">*</span></FormLabel>
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
                            name="alterarSenha"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            id="alterarSenha"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel htmlFor="alterarSenha">Alterar senha</FormLabel>
                                </FormItem>
                            )}
                        />

                        {formAtualizarPerfil.watch("alterarSenha") && (
                            <>
                                <FormField
                                    control={formAtualizarPerfil.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="senha">Senha <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    form={formAtualizarPerfil}
                                                    field={field}
                                                    id="new-password"
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
                                            <FormLabel htmlFor="confirmaSenha">Confirmar Senha <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    form={formAtualizarPerfil}
                                                    field={field}
                                                    id="confirmaSenha"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <div className="pt-4">
                            <ButtonLoading isLoading={isLoadingCriarInscricao} className={"w-full"}>
                                Atualizar
                            </ButtonLoading>
                        </div>
                    </form>
                </Form>

                <div className="flex flex-col items-center mt-2">
                    <Separator />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="link"
                                className="mt-4 text-sm text-red-500"
                            >
                                Deletar conta
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza que deseja continuar?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação é <strong>irreversível</strong>. Ao prosseguir, sua conta será excluída permanentemente e todos os seus dados, incluindo certificados, serão perdidos.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => excluirConta()}>Excluir conta</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    );
}