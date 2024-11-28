"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { z } from "zod";
import LogoFslab from "../../../../public/assets/logo_fslab.jpeg";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { authSchema } from "@/src/schemas/authSchema";
import { fetchApi } from "@/src/utils/fetchApi";



export default function RecuperarSenhaPage() {
    const router = useRouter();
    const [enviouEmail, setEnviouEmail] = useState(false);

    const schema = authSchema.recuperarSenha

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: ""
        }
    });

    async function recuperarSenha(data) {
        const response = await fetchApi("/recuperarsenha", "POST", {
            email: data.email
        }, null, true);

        

        if (response.error) {
            response.errors.forEach(error => {
                console.log(error.message)
                toast.error(error);

                if (error.path) {
                    form.setError(error.path, { type: "custom", message: error.message });
                } else {
                }
            });
        } else {
            toast.success("Email enviado com sucesso!");
            setEnviouEmail(true);
            form.reset();
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center mt-28">
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl flex">
                        <div className="w-1/2 flex justify-center items-center">
                            <Image src={LogoFslab} alt="Logo FSLAB" width={300} height={300} className="mt-14" />
                            <Separator className="ml-10" orientation />
                        </div>
                        <div className="w-1/2">
                            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                                <h1 className="text-2xl font-bold">Recuperar senha</h1>
                            </div>
                            <Card>
                                <CardContent>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(recuperarSenha)} className="space-y-4" id="formRecuperarSenha">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="email">E-mail</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} id="email" type="email" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </form>
                                    </Form>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            className="flex items-center space-x-2 mr-10"
                                            onClick={() => router.push("/")}
                                            variant="secondary"
                                        >
                                            <ArrowLeft size={24} />
                                            <span>Voltar</span>
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex items-center space-x-2"
                                            disabled={form.formState.isSubmitting}
                                            form="formRecuperarSenha"
                                        >
                                            <MailCheck size={24} />
                                            <span>Recuperar senha</span>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
