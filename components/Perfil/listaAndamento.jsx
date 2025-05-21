"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { formatarData } from "@/src/utils/mascaras";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaAndamento({ titulo, data }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const cardsVisiveis = expanded ? data : data?.slice(0, 4);



    console.log(data)
    return (
        <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-6">Cursos em andamento</h2>

            {/* Container com overflow controlado */}
            <div className="transition-all duration-900">
                <div
                    className={`grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-6 justify-items-center sm:place-content-center"> ${expanded
                        ? "opacity-100"
                        : "opacity-90 overflow-hidden"
                        }`}
                >
                    {cardsVisiveis?.map((card, index) => (
                        <Card key={index} className="w-full max-w-[25rem] h-[23rem] max-h-[23rem] flex flex-col">
                            <CardContent className="flex flex-col items-center text-center pt-6 pb-4 px-4">
                                <div
                                    className={`w-full`}
                                >
                                    <img
                                        src={handleImagePath(`/cursos/${card.cursoId}/capa`)}
                                        alt="Capa do curso"
                                        className="w-full h-40 object-cover rounded-sm"
                                        onError={(event) => {
                                            event.target.parentNode.innerHTML = 
                                            `
                                                <span class="w-full h-40 flex items-center justify-center text-gray-500 bg-gray-100 rounded-sm">
                                                    Imagem indisponível
                                                </span>
                                            `;
                                        }}
                                    />
                                </div>
                                <h3 className="text-sm  mt-4">
                                    {card.curso.nome}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Inscrito em {formatarData(card.dataInscricao)}
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" onClick={() => {
                                        router.push(`/curso/${card.cursoId}`);
                                    }}>
                                        Ir ao curso
                                    </Button>

                                </div>
                            
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {data?.length > 4 && (
                <div className="mt-6 text-center">
                    <Button onClick={() => setExpanded(!expanded)} variant="ghost">
                        {expanded
                            ? "Ver menos cursos em andamento"
                            : `Ver todos os cursos em andamento (${data?.length - 4})`}
                    </Button>
                </div>
            )}

        </div>
    );
}