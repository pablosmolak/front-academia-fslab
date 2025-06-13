"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { formatarData } from "@/src/utils/mascaras";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaAndamento({ data }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const cardsVisiveis = expanded ? data : data?.slice(0, 4);

    return (
        <div className="mt-4">
            <h2 className="
                text-xl xl:text-3xl 
                font-semibold 
                mb-6
                text-center md:text-start
            "
            >Cursos em andamento</h2>

            {cardsVisiveis?.length === 0 ? (
                <div className="flex flex-col gap-4 text-center text-black pt-4 pb-4 xl:pt-8 xl:pb-8">
                    <p className="text-center text-md xl:text-xl">Poxa, você ainda não está inscrito em nenhum curso 😢</p>
                    <Button
                        onClick={() => router.push('/')}
                        className="mx-auto"
                    >
                        Vamos começar agora!
                    </Button>
                </div>
            ) : (
                <section>
                    <div
                        className={`grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] 
                                gap-6 justify-items-center sm:place-content-center`}
                    >
                        {cardsVisiveis?.map((card, index) => (
                            <Card key={index} className="w-full max-w-[25rem] h-[26rem] max-h-[26rem] md:h-[23rem] md:max-h-[23rem] flex flex-col">
                                <CardHeader>
                                    <img
                                        src={handleImagePath(`/cursos/${card.cursoId}/capa`)}
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

                                <CardContent className="grow flex gap-2 flex-col">
                                    <p className="text-base font-bold line-clamp-2">{card.curso.nome}</p>
                                    <p className="text-sm text-gray-600">
                                        Inscrito em {formatarData(card.dataInscricao)}
                                    </p>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className='w-full'
                                        variant="outline"
                                        onClick={() => {
                                            router.push(`/curso/${card.cursoId}`);
                                        }}
                                    >
                                        Ir ao curso
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {data?.length > 4 && (
                        <div className="mt-6 text-center">
                            <Button onClick={() => setExpanded(!expanded)} variant="ghost">
                                {expanded
                                    ? "Ver menos cursos em andamento"
                                    : `Ver mais cursos em andamento (${data?.length - 4})`}
                            </Button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}