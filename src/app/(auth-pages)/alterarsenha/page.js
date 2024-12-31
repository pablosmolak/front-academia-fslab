"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { alteraSenhaSchema } from "@/src/schemas/alteraSenhaSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LogoFslab from "../../../../public/assets/logo_fslab.jpeg";

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

        console.log(data)

        const response = await fetchApi(`/alterarsenha?token=${data.token}&email=${data.email}`, "POST", {
            senha: data.senha,
        })

        console.log(response)

        if (response.error) {
            handleFormErrors(response.errors, form);
            response?.errors?.forEach(error => {
                if (error.path === "token" || error.path === "email") {
                    toast.error(`Erro no campo '${error.path}': ${error.message}`);
                }
            });
        }
        else {
            toast.success("Email enviado com sucesso!")
            form.reset({ email: "" })
        }

        setLoadingAlterar(false)
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl flex flex-col md:flex-row">
                    {/* Container da Imagem e do Separador */}
                    <div className="w-full md:w-1/2 flex justify-center hidden md:flex">
                        <div className="content-center">
                            <Image src={LogoFslab} alt="Logo FSLAB" width={300} height={300} className="" />
                        </div>
                        <Separator className="ml-10" orientation='vertical' />
                    </div>
                    {/* Container do Formulário */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center justify-center mb-8">
                            <h1 className="text-2xl font-bold">Recuperar senha</h1>
                        </div>

                        <Card>
                            <Form {...form}>
                                <form id="formAlterarSenha" onSubmit={form.handleSubmit(alterarSenha)} className="flex flex-col pt-4">
                                    <CardContent>
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
                                    </CardContent>
                                    <CardFooter className="flex justify-center">
                                        <ButtonLoading
                                            type="submit"
                                            className="flex items-center space-x-2 w-full"
                                            isLoading={LoadingAlterar}
                                            form="formAlterarSenha">
                                            Alterar senha
                                        </ButtonLoading>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </>

    )
}

