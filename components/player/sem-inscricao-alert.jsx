import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/src/utils/fetchApi";
import { toast } from "react-toastify";

export function SemInscricaoAlert({ cursoId,criarInscricao,isLoadingCriarInscricao }) {
    const router = useRouter();

    return (
        <AlertDialog open>
            <AlertDialogContent className="bg-zinc-800 border border-zinc-700">
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-gray-100"
                    >
                        Inscrição não encontrada
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        className="text-gray-300"
                    >
                        Deseja realizar sua inscrição neste curso?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter
                    className="flex gap-2"
                >
                    <AlertDialogCancel
                        onClick={() => {
                            router.push(`/curso/${cursoId}`);
                        }}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-green-700 hover:bg-green-600 text-white"
                        disabled={isLoadingCriarInscricao}
                        onClick={() => criarInscricao()}
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
