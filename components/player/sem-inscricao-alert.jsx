// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation";

// export function SemInscricaoAlert({cursoId}) {
//     const router = useRouter();

//     console.log(cursoId)

//     const CriarInscricao = async () =>{

//     }

//     return (
//         <AlertDialog open>
//             <AlertDialogContent>
//                 <AlertDialogHeader>
//                     <AlertDialogTitle>Inscrição não encontrada</AlertDialogTitle>
//                     <AlertDialogDescription>
//                         Deseja realizar sua inscrição neste curso?
//                     </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                     <AlertDialogCancel
//                         onClick={() => {
//                             router.push(`/curso/${cursoId}`)
//                         }}
//                     >
//                         Cancelar
//                     </AlertDialogCancel>
//                     <AlertDialogAction
//                         onClick={() => {

//                         }}
//                     >Confirmar
//                     </AlertDialogAction>
//                 </AlertDialogFooter>
//             </AlertDialogContent>
//         </AlertDialog>
//     )
// }


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

export function SemInscricaoAlert({ cursoId }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: criarInscricao, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await fetchApi(`/inscricoes`, "POST", { cursoId });
            if (response.error) {
                throw new Error(response.message);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getInscricao", cursoId]); // Recarrega a consulta de inscrição
        },
        onError: (error) => {
            console.error("Erro ao criar inscrição:", error);
        },
    });

    return (
        <AlertDialog open>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Inscrição não encontrada</AlertDialogTitle>
                    <AlertDialogDescription>
                        Deseja realizar sua inscrição neste curso?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            router.push(`/curso/${cursoId}`);
                        }}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={() => criarInscricao()}
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
