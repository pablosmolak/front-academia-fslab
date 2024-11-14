import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import Link from "next/link"

export default async function CardsCursos({ filtros }) {

    const response = await fetchApi("/cursos", "GET", {
        ///  querys: searchParams,
        //  hiddenQuerys: hiddenQuerys,
        // schema: schema
    }, {
        next: {
            tags: ["fetchTag"]
        }
    });

    if (response.error) {
        console.log(response.errors)
        /*return (
         <ErrorGetTable errors={response.errors} />
        )*/
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
            {response.data?.map((data, index) => (
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
        </div>


    );
}
