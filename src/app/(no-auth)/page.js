import CardsCursos from "@/components/paginaInicial/cards"

export default function paginaInicial() {

    return (
        <div className="flex flex-wrap justify-between gap-4 m-4 mx-16">
            <CardsCursos></CardsCursos>
        </div>
    )
}