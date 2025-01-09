"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { recuperarSenhaSchema } from "@/src/schemas/recuperaSenhaSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LogoFslab from "../../../../public/assets/logo_fslab.jpeg";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
           // form.reset({ email: "" })
        }

        setLoadingRecuperar(false)
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
                                <form id="formRecuperarSenha" onSubmit={form.handleSubmit(recuperarSenha)} className="flex flex-col pt-4">
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="email"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            type="button"
                                            className="space-x-2 mr-10 w-32"
                                            onClick={() => router.push("/login")}
                                            variant="secondary"
                                        >
                                            <ArrowLeft size={24} />
                                            <span>Voltar</span>
                                        </Button>

                                        <ButtonLoading
                                            className="flex items-center space-x-2 w-36"
                                            isLoading={LoadingRecuperar}
                                            form="formRecuperarSenha">
                                            Recuperar senha
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

