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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";
import logoFslab from "../../../../public/assets/logo_fslab.jpeg";
import { authSchema } from "@/src/schemas/authSchema";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleFormErrors } from "@/src/errors/handleFormErrors";
import ButtonLoading from "@/components/buttonLoading";


export default function LoginPage() {

    const [LoadingCadastrar, setLoadingCadastrar] = useState(false)

    const router = useRouter();

    const schemaLogar = authSchema.logar
    const schemaCadastrar = authSchema.cadastrar

    const formLogar = useForm({
        resolver: zodResolver(schemaLogar),
        defaultValues: {
            email: "dev@gmail.com",
            senha: "Dev@1234"
        }
    });

    const formCadastrar = useForm({
        resolver: zodResolver(schemaCadastrar),
        defaultValues: {
            nome: "pedrim",
            email: "dev@gmail.com",
            senha: "Dev@1234",
            confirmarSenha: "Dev@1234"
        }
    });

    async function login(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await signIn("credentials", {
            email: data.email,
            senha: data.senha,
            redirect: false
        })

        if (response.ok && !response.error) {
            router.replace("/");
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

            setLoadingCadastrar(false)
        }
    }

    async function cadastrar(data) {
        setLoadingCadastrar(true)

        const response = await fetchApi("/usuarios", "POST", {
            nome: data.nome,
            email: data.email,
            senha: data.senha
        });

        if (response.error) {

            if(response.code === 422){
                toast.error("Erro ao cadastrar o usuário, verifique o formulário!")
            }

            handleFormErrors(response.errors, formCadastrar);

            setLoadingCadastrar(false)
        } else {
            toast.success("Cadastro realizado com sucesso!");

            login({
                email: data.email,
                senha: data.senha
            })
        }
    }

    const logo = logoFslab;

    return (
        <div className="flex flex-col justify-center ">
            <main className="flex-grow flex items-center justify-center p-4">
                <Tabs defaultValue="login" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="cadastrar">Cadastre-se</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader className="items-center">
                                <Image src={logo} alt="Logo FSLab" width={200} height={200} />
                            </CardHeader>
                            <Form {...formLogar}>
                                <form
                                    className="space-y-4" id="formLogin"
                                    onSubmit={formLogar.handleSubmit(login)}
                                >
                                    <CardContent>
                                        <FormField
                                            control={formLogar.control}
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
                                            control={formLogar.control}
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
                                        <ButtonLoading
                                            className="w-full"
                                            isLoading={formLogar.formState.isSubmitting}
                                            form="formLogin">
                                            Entrar
                                        </ButtonLoading>
                                        <Link className="text-sm mt-2 hover:underline" href={"/recuperarsenha"}>
                                            Esqueceu a senha?
                                        </Link>

                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cadastrar">
                        <Card>
                            <CardHeader className="items-center">
                                <Image src={logo} alt="Logo FSLab" width={200} height={200} />
                            </CardHeader>
                            <Form {...formCadastrar}>
                                <form
                                    className="space-y-4" id="formCadastrar"
                                    onSubmit={formCadastrar.handleSubmit(cadastrar)}
                                >
                                    <CardContent>
                                        <FormField
                                            control={formCadastrar.control}
                                            name="nome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="email">Nome</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="nome"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formCadastrar.control}
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
                                            control={formCadastrar.control}
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
                                            control={formCadastrar.control}
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
                                    <CardFooter className="flex flex-col">
                                        <ButtonLoading
                                            className="w-full"
                                            isLoading={LoadingCadastrar}
                                            form="formCadastrar">
                                            Cadastrar
                                        </ButtonLoading>
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
