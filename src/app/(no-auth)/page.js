"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
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

export default function LoginPage() {
    const router = useRouter();

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

    return (
        <div className="flex flex-col justify-center mt-28">
            <main className="flex-grow flex items-center justify-center p-4">
                <Tabs defaultValue="login" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="cadastrar">Cadastra-se</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                            </CardHeader>
                            <Form {...form}>
                                <form className="space-y-4">
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
                                        <Button type="submit" className="w-full">Entrar</Button>
                                        <Link className="text-sm mt-2 hover:underline" href={"/recuperarsenha"}>
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
