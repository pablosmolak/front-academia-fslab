'use client'

import ButtonLoading from "@/components/buttonLoading"
import InputPassword from "@/components/inputPassword"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import logoFslab from "@/public/assets/logo_fslab.svg"
import { getUserInfos } from "@/src/actions/authAction"
import { ApplicationContext } from "@/src/context/applicationContext"
import { handleFormErrors } from "@/src/errors/handleFormErrors"
import { authSchema } from "@/src/schemas/authSchema"
import { fetchApi } from "@/src/utils/fetchApi"
import { handleImagePath } from "@/src/utils/handleImagePath"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [LoadingCadastrar, setLoadingCadastrar] = useState(false)

    const router = useRouter();

    const { user, setUser } = useContext(ApplicationContext);

    const schemaLogar = authSchema.logar
    const schemaCadastrar = authSchema.cadastrar

    const formLogar = useForm({
        resolver: zodResolver(schemaLogar),
        defaultValues: {
            email: "",
            senha: ""
        }
    });

    const formCadastrar = useForm({
        resolver: zodResolver(schemaCadastrar),
        defaultValues: {
            nome: "",
            "new-email": "",
            "new-senha": "",
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


            const user = await getUserInfos();
            setUser(() => ({
                ...user,
                fotoPerfilUrl: handleImagePath(`/usuarios/${user.id}/image?time=${Date.now()}`)
            }));

            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            sessionStorage.removeItem('redirectPath');

            router.replace(redirectPath);
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
            nome: data["nome"],
            email: data['new-email'],
            senha: data['new-senha']
        });

        if (response.error) {

            if (response.code === 422) {
                toast.error("Erro ao cadastrar o usuário, verifique o formulário!")
            }

            handleFormErrors(response.errors, formCadastrar);

            setLoadingCadastrar(false)
        } else {
            toast.success("Cadastro realizado com sucesso!");

            login({
                email: data['new-email'],
                senha: data['new-senha']
            })
        }
    }

    return (
        <div className="relative w-full max-w-3xl h-[550px] overflow-hidden rounded-xl shadow-lg">
            <div className="flex w-full h-full">

                <div className={cn(
                    "w-full md:w-1/2 p-2 md:p-8 flex items-center justify-center",
                    isSignUp ? "hidden md:flex" : "flex"
                )}>
                    <div className="w-full max-w-sm space-y-4">
                        <div className="text-center mb-14">
                            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                            <p className="text-muted-foreground">Login na conta Academia FSLab</p>
                        </div>
                        <Form {...formLogar}>
                            <form
                                className="space-y-4" id="formLogin"
                                onSubmit={formLogar.handleSubmit(login)}
                            >
                                <FormField
                                    control={formLogar.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email">E-mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    autoComplete="email"
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
                                            <div className="flex items-center">
                                                <FormLabel htmlFor="senha">Senha</FormLabel>
                                                <Link
                                                    href="/recuperarsenha"
                                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                                >
                                                    Esqueceu sua senha?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <InputPassword
                                                    form={formLogar}
                                                    field={field}
                                                    id="senha"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ButtonLoading
                                    className="w-full"
                                    isLoading={formLogar.formState.isSubmitting}
                                    form="formLogin">
                                    Entrar
                                </ButtonLoading>
                            </form>
                        </Form>

                        <div className="text-center text-sm">
                            Não tem uma conta?{" "}
                            <button
                                className="underline underline-offset-4"
                                onClick={() => setIsSignUp(true)}
                            >
                                Inscreva-se
                            </button>
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "w-full md:w-1/2 p-2 md:p-8  flex items-center justify-center",
                    isSignUp ? "flex" : "hidden md:flex"
                )}>
                    <div className="w-full max-w-sm space-y-4">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Criar Conta</h1>
                            <p className="text-muted-foreground">Cadastre-se na Academia FLab</p>
                        </div>
                        <Form {...formCadastrar}>
                            <form
                                className="space-y-2 pt-2" id="formCadastrar"
                                onSubmit={formCadastrar.handleSubmit(cadastrar)}
                            >

                                <FormField
                                    control={formCadastrar.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="nome">Nome <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id="nome"
                                                    autoComplete="off"
                                                    {...field}

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formCadastrar.control}
                                    name="new-email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="new-email">E-mail <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id="new-email"
                                                    autoComplete="new-email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formCadastrar.control}
                                    name="new-senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="new-senha">Senha <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    form={formLogar}
                                                    field={field}
                                                    id="new-senha"
                                                    autoComplete="new-senha"

                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <ButtonLoading
                                    className="w-full"
                                    isLoading={LoadingCadastrar}
                                    form="formCadastrar">
                                    Cadastrar
                                </ButtonLoading>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Já tem uma conta?{" "}
                            <button
                                className="underline underline-offset-4"
                                onClick={() => setIsSignUp(false)}
                            >
                                Fazer login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    "hidden md:flex absolute top-0 left-0 h-full w-1/2 bg-muted z-10 transition-transform duration-700 ease-in-out will-change-transform items-center justify-center",
                    isSignUp ? "translate-x-0" : "translate-x-full"
                )}
            >
                <Image
                    src={logoFslab}
                    alt="Logo FSLab"
                    className="object-contain w-3/4 max-w-xs h-auto dark:brightness-[0.2]"
                />
            </div>
        </div>

    )
}