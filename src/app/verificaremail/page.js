"use client";

import ButtonLoading from "@/components/buttonLoading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logoFslab from "@/public/assets/logo_fslab.svg";
import { ApplicationContext } from "@/src/context/applicationContext";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import { verificaEmailSchema } from "@/src/schemas/verificaEmailSchema";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
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
    const SolicitarNovoCodigo = async () => {

        const response = await fetchApi("/verificaremail/enviarcodigo", "POST")

        if (response.error) {
            handleFormErrors(response.errors, form);
        }
        else {
            toast.success("Código enviado com sucesso!")
        }
    }

    if (!user?.emailVerificado) {
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
                                <h1 className="text-2xl font-bold">Verificar e-mail</h1>
                                <p className="text-muted-foreground">Verifique seu e-mail preenchendo o código</p>
                            </div>
                            <Form {...form}>
                                <form
                                    id="formRecuperarSenha"
                                    onSubmit={form.handleSubmit(recuperarSenha)}
                                    className="space-y-2 pt-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name="codigoVerificacaoEmail"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-2">
                                                <FormLabel className="flex justify-center">Código Verificação</FormLabel>
                                                <FormControl className="flex justify-items-center">
                                                    <InputOTP
                                                        maxLength={6}
                                                        id="codigoVerificacaoEmail"
                                                        {...field}
                                                    >
                                                        <InputOTPGroup>
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
                                    <div className="pt-4 w-full flex flex-col items-center">
                                        <ButtonLoading
                                            type="submit"
                                            className="w-full max-w-sm"
                                            isLoading={LoadingVerificar}
                                            form="formRecuperarSenha"
                                        >
                                            Verificar e-mail
                                        </ButtonLoading>
                                        <Button
                                            type="button"
                                            className="text-black mt-2"
                                            variant="link"
                                            onClick={SolicitarNovoCodigo}
                                        >
                                            Solicitar novo código
                                        </Button>
                                    </div>

                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            // <>
            //     <div className="
            //         py-8 px-4 xl:px-36
            //         flex 
            //         justify-center
            //     ">
            //         <div className="w-full max-w-4xl flex flex-col md:flex-row">
            //             {/* Container da Imagem e do Separador */}
            //             <div className="w-full md:w-1/2 flex justify-center hidden md:flex">
            //                 <div className="content-center">
            //                     <Image src={LogoFslab} alt="Logo FSLAB" width={300} height={300} className="" />
            //                 </div>
            //                 <Separator className="ml-10" orientation='vertical' />
            //             </div>
            //             {/* Container do Formulário */}
            //             <div className="w-full md:w-1/2">
            //                 <div className="flex items-center justify-center mb-8">
            //                     <h1 className="text-2xl font-bold">Verificar Email</h1>
            //                 </div>

            //                 <Card>

            //                 </Card>
            //             </div>
            //         </div>
            //     </div>
            // </>
        )
    }
}