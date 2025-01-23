"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import LogoFslab from "@/public/assets/logo_fslab.jpeg";
import { ApplicationContext } from "@/src/context/applicationContext";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { verificaEmailSchema } from "@/src/schemas/verificaEmailSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function VerificarEmailPage() {
    const router = useRouter();

    const { user, setUser } = useContext(ApplicationContext);

    if (user?.emailVerificado) {
        router.replace('/');
    }

    const [LoadingVerificar, setLoadingVerificar] = useState(false)

    const schema = verificaEmailSchema.verificarEmail

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            codigoVerificacaoEmail: ""
        }
    })

    const recuperarSenha = async (data) => {
        setLoadingVerificar(true)

        const response = await fetchApi("/verificaremail", "POST", {
            codigoVerificacaoEmail: data.codigoVerificacaoEmail
        })

        if (response.error) {
            handleFormErrors(response.errors, form);
        }
        else {
            toast.success("Email verificado com sucesso!")

            setUser((prevUser) => ({
                ...prevUser, // Mantém as propriedades existentes
                emailVerificado: true, // Atualiza apenas o email
            }));

            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            sessionStorage.removeItem('redirectPath');

            router.replace(redirectPath);
        }
    }

    if (!user?.emailVerificado) {
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
                                <h1 className="text-2xl font-bold">Verificar Email</h1>
                            </div>

                            <Card>
                                <Form {...form}>
                                    <form id="formRecuperarSenha" onSubmit={form.handleSubmit(recuperarSenha)} className="flex flex-col pt-4">
                                        <CardContent className="flex justify-center">
                                            <FormField
                                                control={form.control}
                                                name="codigoVerificacaoEmail"
                                                render={({ field }) => (
                                                    <FormItem >
                                                        <FormLabel className="flex justify-center">Código Verificação</FormLabel>
                                                        <FormControl >
                                                            <InputOTP
                                                                maxLength={6}
                                                                id="codigoVerificacaoEmail"
                                                                {...field}

                                                            >
                                                                <InputOTPGroup className="flex justify-center">
                                                                    <InputOTPSlot index={0} />
                                                                    <InputOTPSlot index={1} />
                                                                    <InputOTPSlot index={2} />
                                                                    <InputOTPSlot index={3} />
                                                                    <InputOTPSlot index={4} />
                                                                    <InputOTPSlot index={5} />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        </FormControl>
                                                        <FormMessage className="flex justify-center" />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="flex justify-center flex-col gap-1">
                                            <ButtonLoading
                                                type="submit"
                                                className="flex items-center space-x-2 w-56"
                                                isLoading={LoadingVerificar}
                                                form="formRecuperarSenha">
                                                Verificar email
                                            </ButtonLoading>
                                            <Button type="button" className="text-black" variant="link">Solicitar novo código</Button>
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
}