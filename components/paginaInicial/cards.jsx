"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function CardsCursos({ dados }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dados.map((data, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <img
                                src={data.capa} 
                                alt="Capa do curso"
                            />
                        </CardHeader>
                        <CardContent>
                            <p>{data.nome}</p>
                            <p>
                                {data.instrutores
                                    .map((instrutor) => instrutor.nome)
                                    .join(', ')}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/curso/${data.id}`} className="bg-yellow-300 w-full flex justify-center items-center">
                                <p>Clique aqui</p>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
