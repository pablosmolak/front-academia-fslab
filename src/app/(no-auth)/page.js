"use client";
import PaginationComponent from "@/components/paginationComponent";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cursoSchema } from "@/src/schemas/cursoSchema";
import { createURLSearch } from "@/src/utils/createURLSearch";
import { fetchApi } from "@/src/utils/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function paginaInicial({ searchParams }) {

    const router = useRouter();
    const schema = cursoSchema.filtrarCurso

    const {
        data: [cursos, pagina, totalPaginas] = [],
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ["getCursos", searchParams],
            queryFn: async () => {
                const response = await fetchApi("/cursos", "GET", {
                    searchParams: searchParams,
                    schema: schema,
                   // hiddenQuerys: hiddenQuerys
                });

                if (response.error) {
                    throw response.errors;
                } else {
                    return [response.data, response.pagina, response.totalPaginas];
                }
            }
        })

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            filtro: ""
        }
    })
    console.log(form.formState.errors)

    const filtrar = async (data) => {
        const url = createURLSearch("/", data);

        router.replace(url);
    }

    if (isError) {
        return (
            <div>
                <p>Deu erro</p>
                {error?.map((erro) => (
                    <span>{erro}</span>
                ))}
            </div>
        )
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(filtrar)}>
                    <FormField
                        control={form.control}
                        name="filtro"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='nome'>Filtro</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        id="filtro"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button>Filtrar</Button>
                </form>
            </Form>

            <div className="flex flex-wrap justify-center gap-4 m-4 mx-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
                    {!isLoading && cursos?.map((data, index) => (
                        <Card key={index} className="max-w-xs max-h-96"> {/* Limite de largura e altura */}
                            <CardHeader>
                                {data.capa ? (
                                    <img
                                        src={handleImagePath(`/cursos/${data.id}/capa`)}
                                        alt="Capa do curso"
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <span
                                        className="w-full h-40 flex items-center justify-center object-cover">
                                        Imagem indisponível
                                    </span> // Texto opcional para o caso de não ter imagem
                                )}
                            </CardHeader>
                            <CardContent>
                                <p>{data.nome}</p>
                                <p>
                                    {data.instrutores.map((instrutor) => instrutor.nome).join(', ')}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href={`/cursos/${data.id}`}
                                    className="bg-yellow-300 w-full flex justify-center items-center"
                                >
                                    <p>Clique aqui</p>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}

                    {!isLoading && totalPaginas > 1 && (
                        <PaginationComponent
                            route={"/"}
                            currentPage={pagina}
                            totalPages={totalPaginas}
                            querys={searchParams}
                            data-test="pagination-component"
                        />)}

                    {isLoading && (<p>carregando</p>)}
                </div>
            </div>
        </>
    )
}