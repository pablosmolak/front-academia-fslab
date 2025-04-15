import { fetchApi } from "@/src/utils/fetchApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ButtonLoading from "../buttonLoading";
import { toast } from "react-toastify";

export function ProximoConteudoButton({ progresso, videoNofim, conteudo, curso, onVideoChange, onRecemFinalizadoChange }) {

    const queryClient = useQueryClient();

    const { mutate: finalizarConteudo, isPending: isLoadingFinalizarAtividade } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/progressos/finalizaratividade/${conteudo.id}`, "POST")

            if (response.error) {
                throw response.errors
            }

            return response.data[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["getProgresso", progresso.cursoId]);
            queryClient.invalidateQueries(["getCertificado", progresso.cursoId]);

            if (!data.certificado) {
                proximoConteudo()
            } else {
                onVideoChange({
                    ...conteudo,
                    titulo:"Certificado",
                    conteudo: "https://youtu.be/Ptbkjjf68ee"
                })
                onRecemFinalizadoChange(true)
            }
        },
        onError: (errors) => {
            toast.error("Não foi possível finalizar este conteúdo!");
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

        console.log("proximo")
        console.log(proximo)

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

    if (!ConteudoAtualConcluido /*&& videoNofim*/) {
        return (
            <>
                <ButtonLoading
                    isLoading={isLoadingFinalizarAtividade}
                    type="button"
                    onClick={() => { finalizarConteudo() }}
                    className="w-44"
                >
                    Próximo conteúdo
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
                    Próximo conteúdo
                </ButtonLoading>
            </>
        )
    }
}
