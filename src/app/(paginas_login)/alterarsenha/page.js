"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import logoFslab from "@/public/assets/logo_fslab.svg";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { alteraSenhaSchema } from "@/src/schemas/alteraSenhaSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AlterarSenhaPage({ searchParams }) {
    const router = useRouter();

    const [LoadingAlterar, setLoadingAlterar] = useState(false)

    const schema = alteraSenhaSchema.alterar

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            senha: "",
            confirmarSenha: "",
            token: ""
        }
    })

    useEffect(() => {
        if (searchParams) {
            for (let query in searchParams) {
                let value = searchParams[query];

                if (value) form.setValue(query, value);
            }
        }
    }, []);

    const alterarSenha = async (data) => {
        setLoadingAlterar(true)

        const response = await fetchApi(`/alterarsenha?token=${data.token}&email=${data.email}`, "POST", {
            senha: data.senha,
        })

        if (response.error) {
            handleFormErrors(response.errors, form);
            response?.errors?.forEach(error => {
                if (error.path === "token" || error.path === "email") {
                    toast.error(`Erro no campo '${error.path}': ${error.message}`);
                }
            });
        }
        else {
            toast.success("Senha alterada com sucesso!")
            router.replace("/login");
        }

        setLoadingAlterar(false)
    }

    return (
        <div className="relative w-full max-w-3xl h-[550px] overflow-hidden rounded-xl shadow-lg">
            <div className="flex w-full h-full">
                <div className={
                    "hidden md:flex h-full w-1/2 bg-muted items-center justify-center"
                }>
                    <Image
                        src={logoFslab}
                        alt="Logo FSLab"
                        className="object-contain w-3/4 max-w-xs h-auto dark:brightness-[0.2]"
                    />
                </div>
                <div className={`
                w-full 
                md:w-1/2 
                p-2 md:p-8 
                flex items-center justify-center block
            `}>
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Alterar Senha</h1>
                            <p className="text-muted-foreground">Altere sua senha na Academia FSLab</p>
                        </div>
                        <Form {...form}>
                            <form
                                id="formAlterarSenha"
                                onSubmit={form.handleSubmit(alterarSenha)}
                                className="space-y-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="senha">Senha</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    id="senha"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmarSenha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="senha">Confirmar Senha</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    id="confirmarSenha"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-4">
                                    <ButtonLoading
                                        type="submit"
                                        className="w-full"
                                        isLoading={LoadingAlterar}
                                        form="formAlterarSenha">
                                        Alterar senha
                                    </ButtonLoading>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

