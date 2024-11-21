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
import logoFslab from "../../../../public/assets/logo_fslab.jpeg";
import { authSchema } from "@/src/schemas/authSchema";

export default function LoginPage() {
    const router = useRouter();

    const [send, setSend] = useState(false);

    const schema = authSchema.logar

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            senha: ""
        }
    });

    async function login(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await signIn("credentials", { // Pablo precisa fazer os metodos da autenticação aqui no caso o SignIn !
            credencial: data.email,
            senha: data.senha,
            redirect: false
        })

        if (response.ok && !response.error) {
            router.replace("/inicio");
        } else {

            switch (response.error) {
                case "fetch failed":
                    toast.error("Servidor fora do ar, contate o Administrador do sistema!");
                    break;
                case "CredentialsSignin":
                    toast.error("E-mail ou senha incorreta!");
                    break;
                default:
                    toast.error("Erro ao capturar mensagem do servidor, contate o Administrador do sistema!");
            }
        }
    }


    const logo = logoFslab;

    return (
        <div className="flex flex-col justify-center ">
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="email">E-mail</FormLabel>
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
