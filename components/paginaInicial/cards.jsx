"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"


export default function CardsCursos({ dados }) {
    return (
        <>
            <div className="columns-3">
                {dados.map((data, index) => (
                    <Card key={index}>
                        <CardHeader>

                            <img
                                src="https://www.pontotel.com.br/local/wp-content/uploads/2022/05/imagem-corporativa.webp" // URL da imagem externa
                                alt="Descrição da imagem" // Descrição para acessibilidade

                            />
                        </CardHeader>
                        <CardContent>
                            <p>Curso de css: criando um txto</p>
                            <p>pablo Smolak</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/login" passHref>
                                <p >Clique aqui</p>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </>
    )
}