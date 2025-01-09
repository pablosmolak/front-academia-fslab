"use client";
import ButtonLoading from "@/components/buttonLoading";
import PaginationComponent from "@/components/paginationComponent";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
                <form id="formFiltrar" onSubmit={form.handleSubmit(filtrar)} className="flex flex-row justify-center space-x-2 pt-4">
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
                                        className="w-full h-full border rounded-md"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ButtonLoading
                        className="w-32"
                        isLoading={isLoading}
                        form="formFiltrar">
                        Filtrar
                    </ButtonLoading>
                </form>
            </Form>

            <div className="flex flex-wrap justify-center gap-4 mt-10 ">
                {!isLoading && (
                    <div className="flex flex-wrap justify-center gap-4">
                        {cursos?.map((data, index) => (
                            <Card
                                key={index}
                                className="w-72 flex-shrink-0" // Fixando o tamanho dos cards
                            >
                                <CardHeader>
                                    <img
                                        src={handleImagePath(`/cursos/${data.id}/capa`)}
                                        alt="Capa do curso"
                                        className="w-full h-40 object-cover rounded-sm"
                                        onError={(event) => {
                                            event.target.parentNode.innerHTML = `
                                            <span class="w-full h-40 flex items-center justify-center text-gray-500 bg-gray-100 rounded-sm">
                                                Imagem indisponível
                                            </span>
                                        `
                                        }}
                                    />
                                </CardHeader>

                                <CardContent>
                                    <p className="text-base font-bold truncate">{data.nome}</p>
                                    <p className="text-sm text-gray-600">
                                        {data.instrutores.map((instrutor) => instrutor.nome).join(', ')}
                                    </p>
                                </CardContent>

                                <CardFooter>
                                    <Link
                                        href={`/curso/${data.id}`}
                                        className="
                                        w-full 
                                        flex 
                                        justify-center 
                                        items-center 
                                        py-2 
                                        rounded-sm
                                        border 
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
                    </div>)}

                {isLoading && (
                    <div className="flex flex-wrap justify-center gap-4">
                        {[...Array(12)].map((_, index) => (
                            <Card
                                key={index}
                                className="w-72 flex-shrink-0"
                            >
                                <CardHeader>
                                    <Skeleton className="w-full h-40" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-3/6 h-4" />

                                </CardContent>
                                <CardFooter>
                                    <Skeleton className="w-full h-11" />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && cursos.length > 0 && (
                    <PaginationComponent
                        route={"/"}
                        currentPage={pagina}
                        totalPages={totalPaginas}
                        querys={searchParams}
                        data-test="pagination-component"
                    />)}
            </div>
        </>
    )
}