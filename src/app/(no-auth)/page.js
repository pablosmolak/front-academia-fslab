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
import { Skeleton } from "@/components/ui/skeleton";
import { cursoSchema } from "@/src/schemas/cursoSchema";
import { createURLSearch } from "@/src/utils/createURLSearch";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
                    querys: searchParams,
                    schema: schema,
                    hiddenQuerys: { limite: 12 }
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
    // console.log(form.formState.errors)

    const filtrar = async (data) => {
        data.pagina = 1
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

    useEffect(() => {
        if (searchParams) {
            for (let query in searchParams) {
                let value = searchParams[query];

                if (value) form.setValue(query, value);
            }
        }
    }, []);

    return (
        <>
            <Form {...form} className="flex justify-center items-center h-screen ">
                <form onSubmit={form.handleSubmit(filtrar)} className="flex flex-row justify-center space-x-2 pt-4">
                    <FormField
                        control={form.control}
                        name="filtro"
                        render={({ field }) => (
                            <FormItem className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                { /*<FormLabel htmlFor="filtro" className="">Filtro</FormLabel>*/}
                                <FormControl>
                                    <Input
                                        type="text"
                                        id="filtro"
                                        placeholder="Pesquisar"
                                        className="w-full p-2 border rounded-md"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-32">Filtrar</Button>
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
                                    className="w-full 
                                    flex 
                                    justify-center 
                                    items-center 
                                    rounded-sm 
                                    border-[0.1px]
                                    border-solid 
                                    border-black 
                                    hover:bg-[#15803D] 
                                    hover:text-white"
                                >
                                    <p>Quero fazer esse curso</p>
                                </Link>


                            </CardFooter>
                        </Card>
                    ))}

                </div>
                {!isLoading && totalPaginas > 1 && (
                    <PaginationComponent
                        route={"/"}
                        currentPage={pagina}
                        totalPages={totalPaginas}
                        querys={searchParams}
                        data-test="pagination-component"
                    />)}

                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4 mx-16">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}