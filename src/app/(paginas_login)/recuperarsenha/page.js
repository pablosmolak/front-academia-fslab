"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import logoFslab from "@/public/assets/logo_fslab.svg";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { recuperarSenhaSchema } from "@/src/schemas/recuperaSenhaSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function RecuperarSenhaPage() {
    const router = useRouter();

    const [LoadingRecuperar, setLoadingRecuperar] = useState(false)

    const schema = recuperarSenhaSchema.recuperar

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: ""
        }
    })
    
    const recuperarSenha = async (data) => {
        setLoadingRecuperar(true)

        const response = await fetchApi("/recuperarsenha", "POST", {
            email: data.email,
            urlFront: `${process.env.NEXT_PUBLIC_FRONT_URL}/alterarsenha`
        })

        if (response.error) {
            handleFormErrors(response.errors, form);
        }
        else {
            toast.success("Email enviado com sucesso!")
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/login')
        }

        setLoadingRecuperar(false)
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
                            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
                            <p className="text-muted-foreground">Recupere sua senha na Academia FSLab</p>
                        </div>
                        <Form {...form}
                        >
                            <form
                                className="space-y-6"
                                id="formRecuperarSenha"
                                onSubmit={form.handleSubmit(recuperarSenha)}
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='email'>Email <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    data-test= "inpEmailRecuperarSenha"
                                                    type="text"
                                                    id="email"
                                                    autoComplete='recuperarSenha'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ButtonLoading
                                    data-test="bntRecuperarSenha"
                                    className="w-full"
                                    isLoading={LoadingRecuperar}
                                    form="formRecuperarSenha">
                                    Recuperar senha
                                </ButtonLoading>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Lembrou sua senha?{" "}
                            <Link
                                data-test="linkFazerLogin"
                                href="/login"
                                className="underline underline-offset-4"
                            >Fazer login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

