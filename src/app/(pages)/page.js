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
                const response = await fetchApi("/cursos/publicados", "GET", {
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

    const cursosVisiveis = cursos ?? [];
    const total = cursosVisiveis.length;

    // Supondo 4 colunas como referência em telas maiores:
    const colunas = 5;
    const preenchimento = (colunas - (total % colunas)) % colunas;

    return (
        <>
            <section
                className=" 
                    py-8 px-4 xl:px-36 
                    gap-4 xl:gap-4">
                <Form {...form} className="flex justify-center items-center h-screen ">
                    <form id="formFiltrar" onSubmit={form.handleSubmit(filtrar)} className="flex flex-row justify-center h-14 space-x-2 pt-4">
                        <FormField
                            control={form.control}
                            name="filtro"
                            render={({ field }) => (
                                <FormItem className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
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
                            className="w-36 h-full"
                            isLoading={isLoading}
                            form="formFiltrar">
                            Filtrar
                        </ButtonLoading>
                    </form>
                </Form>

                <div className="mt-10">
                    {!isLoading && (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6 justify-items-center sm:place-content-center">
                            {cursosVisiveis.map((data, index) => (
                                <Card key={index} className="w-full max-w-[20rem] h-[23rem] max-h-[23rem] flex flex-col">
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
                                                `;
                                            }}
                                        />
                                    </CardHeader>

                                    <CardContent className="grow ">
                                        <p className="text-base font-bold line-clamp-2">{data.nome}</p>
                                        <p className="text-sm text-gray-600  truncate">
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

                            {/* Placeholders vazios */}
                            {Array.from({ length: preenchimento }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="hidden sm:inline w-full max-w-[20rem] invisible" />
                            ))}
                        </div>

                    )}

                    {isLoading && (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6 justify-items-center sm:place-content-center">
                            {[...Array(12)].map((_, index) => (
                                <Card
                                    key={index}
                                    className="w-full max-w-[20rem] flex flex-col"
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
            </section>
        </>
    )
}