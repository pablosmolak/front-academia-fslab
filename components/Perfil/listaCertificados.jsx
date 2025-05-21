"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatarData } from "@/src/utils/mascaras";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaCertificados({ titulo, data }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const cardsVisiveis = expanded ? data : data?.slice(0, 4);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">{titulo}</h2>

            {/* Container com overflow controlado */}
            <div className="transition-all duration-900">
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500 ${expanded
                        ? "opacity-100"
                        : "max-h-[900px] opacity-90 overflow-hidden"
                        }`}
                >
                    {cardsVisiveis?.map((card, index) => (
                        <Card key={index} className="relative transition-all duration-500">
                            <CardContent className="flex flex-col items-center text-center pt-6 pb-4 px-4">
                                <div
                                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4`}
                                >
                                    <span className="text-4xl">{"</>"}</span>
                                </div>
                                <h3 className="text-sm font-medium text-blue-600 leading-snug">
                                    {card.curso.nome}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Concluído em {formatarData(card.created_at)}
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" onClick={() => {
                                        router.push(`certificado/${card.validador}`);
                                    }}>
                                        Ver certificado
                                    </Button>
                                    <Button variant="outline">
                                        Adicionar ao perfil
                                    </Button>
                                </div>
                                <BadgeCheck className="absolute top-2 right-2 text-green-500 w-5 h-5" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {data?.length > 4 && (
                <div className="mt-6 text-center">
                    <Button onClick={() => setExpanded(!expanded)} variant="ghost">
                        {expanded
                            ? "Ver menos formações"
                            : `Ver todas as formações concluídas (${data?.length})`}
                    </Button>
                </div>
            )}

        </div>
    );
}