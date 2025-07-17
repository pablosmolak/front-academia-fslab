"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatarData } from "@/src/utils/mascaras";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaCertificados({ data }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const colunas = 4;
    const cardsVisiveis = expanded ? data : data?.slice(0, colunas);

    const total = cardsVisiveis?.length || 0;
    const preenchimento = (colunas - (total % colunas)) % colunas;

    return (
        <div className="mt-4">
            <h2 className="
                text-xl xl:text-3xl 
                font-semibold 
                mb-6
                text-center md:text-start
            "
            >
                Certificados
            </h2>

            {cardsVisiveis?.length === 0 ? (
                <p className="text-center text-md xl:text-lg text-black pt-4 pb-4 xl:pt-8 xl:pb-8">
                    Poxa, ainda não temos nenhum certificado por aqui 😢<br />
                    Que tal concluir alguns cursos e começar a colecionar conquistas? 🎓🚀
                </p>
            ) : (
                <section>
                    <div>
                        <div
                            className={`
                                grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] 
                                gap-6 
                                justify-items-start sm:place-content-start 
                            `
                            }
                        >
                            {cardsVisiveis?.map((card, index) => (
                                <Card key={index} className="w-full max-w-[25rem] h-[26rem] max-h-[26rem] md:h-[23rem] md:max-h-[23rem] flex flex-col">
                                    <CardHeader>
                                        <div
                                            className="w-full h-40 flex items-center justify-center"
                                        >
                                            <GraduationCap size={96} />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="grow flex gap-2 flex-col">
                                        <p className="text-base font-bold line-clamp-2">{card.curso.nome}</p>
                                        <p className="text-sm text-gray-600">
                                            Concluído em {formatarData(card.created_at)}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="flex gap-2 flex-col md:flex-row">
                                        <Button className='w-full' variant="outline" onClick={() => {
                                            router.push(`certificado/${card.validador}`);
                                        }}>
                                            Ver certificado
                                        </Button>
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

                            {Array.from({ length: preenchimento }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="hidden sm:inline w-full max-w-[25rem] invisible" />
                            ))}
                        </div>
                    </div>

                    {data?.length > 4 && (
                        <div className="mt-6 text-center">
                            <Button onClick={() => setExpanded(!expanded)} variant="ghost">
                                {expanded
                                    ? "Ver menos formações"
                                    : `Ver mais Certificados (${data?.length - 4})`}
                            </Button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}