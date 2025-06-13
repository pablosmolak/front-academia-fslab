import { FileBadge, Trophy } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const PlayerCertificadoPage = ({ certificadoValidador }) => {
    return (
        <div className="flex h-full items-center justify-center bg-black text-white pb-28">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-primary rounded-full">
                        <Trophy className="text-black" />
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold">Parabéns!</h1>
                    <p className="text-lg">Você concluiu o curso com sucesso.</p>
                </div>

                <div className="flex justify-center">
                    <Link
                        href={`/usuario/certificado/${certificadoValidador}`}
                        className="bg-primary hover:bg-yellow-500 text-black font-bold py-3 px-12 rounded-lg flex items-center space-x-2"
                    >
                        <FileBadge />
                        <span>Acessar Certificado</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const PlayerCertificadoAlert = ({ certificadoValidador }) => {
    return (
        <Link href={`/usuario/certificado/${certificadoValidador}`}>
            <Alert className="bg-zinc-700 border-none hover:bg-zinc-600 transition-colors duration-200">
                <div className="flex items-center gap-2 ">
                    <FileBadge className="text-gray-200" />
                    <div>
                        <AlertTitle className="text-gray-200 text-base font-semibold">
                            Curso concluído!
                        </AlertTitle>
                        <AlertDescription className="text-gray-400 text-sm">
                            Clique aqui e acesse seu certificado.
                        </AlertDescription>
                    </div>
                </div>
            </Alert>
        </Link>
    )
}

export { PlayerCertificadoAlert, PlayerCertificadoPage };