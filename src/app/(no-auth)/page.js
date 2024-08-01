"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";
import logoFslab from "../../../public/assets/logo_fslab.jpeg";

export default function LoginPage() {
    const router = useRouter();

    const [send, setSend] = useState(false);

    const schema = z.object({
        credencial: z.string({ required_error: "A credencial é obrigatória!" })
            .min(1, { message: "A credencial é obrigatória" }),
        senha: z.string({ required_error: "A senha é obrigatória!" })
            .min(8, { message: "Deve ter no mínimo 8 caracteres!" })
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            credencial: "",
            senha: ""
        }
    });

    async function login(data) {
        const response = await fetchApi("/auth/login", "POST", {
            credencial: data.credencial,
            senha: data.senha
        }, null, true);

        if (response.error) {
            response.errors.forEach(error => {
                if (error.path) {
                    form.setError(error.path, { type: "custom", message: error.message });
                } else {
                    toast.error(error.message);
                }
            });
        } else {
            toast.success("Login efetuado com sucesso!");
            setSend(true);
            form.reset();;
        }
    }

    const logo = logoFslab;

    return (
        <div className="flex flex-col justify-center mt-16">
            <main className="flex-grow flex items-center justify-center p-4">
                <Tabs defaultValue="login" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="cadastrar">Cadastra-se</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader className="items-center">
                                <Image src={logo} alt="Logo FSLab" width={200} height={200} />
                            </CardHeader>
                            <Form {...form}>
                                <form 
                                className="space-y-4" id="formLogin"
                                onSubmit={form.handleSubmit(login)}                                
                                >
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="credencial"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="credencial">E-mail</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="credencial"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <Button type="submit" className="w-full" form="formLogin">Entrar</Button>
                                        <Link className="text-sm mt-2 hover:underline" href={"/recuperarSenha"}>
                                            Esqueceu a senha?
                                        </Link>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
