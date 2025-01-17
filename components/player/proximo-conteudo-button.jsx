import { fetchApi } from "@/src/utils/fetchApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ButtonLoading from "../buttonLoading";
import { array } from "zod";

export function ProximoConteudoButton({ progresso, videoNofim, conteudo, curso, onVideoChange }) {

    const queryClient = useQueryClient();

    const { mutate: finalizarConteudo, isPending: isLoadingFinalizarAtividade } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/progressos/finalizaratividade/${conteudo.id}`, "POST")
            if (response.error) {
                throw new Error(response.message);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getProgresso", progresso.cursoId]);
            proximoConteudo()
        },
        onError: (error) => {
            console.error(`Erro ao criar inscrição: ${error}`);
        },
    });

    const ArrayDeConteudos = curso?.topicos
        .flatMap((topico) => topico.conteudos) || []

    const proximoConteudo = () => {
        const ConteudoAtual = conteudo;

        const indiceConteudoAtual = ArrayDeConteudos.findIndex(
            (conteudo) => conteudo.id === ConteudoAtual.id
        );

        const proximo = ArrayDeConteudos[indiceConteudoAtual + 1];

        if (proximo) {
            onVideoChange(proximo);
        } else {

            if (progresso.atividadeAtual) {
                const indiceConteudo = ArrayDeConteudos.findIndex(
                    (conteudo) => conteudo.id === progresso.atividadeAtual
                );
                onVideoChange(ArrayDeConteudos[indiceConteudo])
            } else {
                onVideoChange(ArrayDeConteudos[0])
            }
        }
    };


    const ConteudoAtualConcluido = progresso?.atividadesConcluidas?.includes(conteudo?.id)

    if (videoNofim) {
        return (
            <>
                <ButtonLoading
                    isLoading={isLoadingFinalizarAtividade}
                    type="button"
                    onClick={() => { finalizarConteudo() }}
                    className="w-44"
                >
                    Finalizar Conteúdo
                </ButtonLoading>
            </>
        )
    } else if (ConteudoAtualConcluido && ((ArrayDeConteudos[ArrayDeConteudos.length - 1]?.id !== conteudo?.id) || progresso.porcentagem !== 100)) {
        return (
            <>
                <ButtonLoading
                    isLoading={isLoadingFinalizarAtividade}
                    type="button"
                    onClick={() => { proximoConteudo() }}
                    className="w-44"
                >
                    Proximo conteúdo
                </ButtonLoading>
            </>
        )
    }
}
