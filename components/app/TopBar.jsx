"use client"
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Usando o hook correto

export default function TopBar() {
    const pathname = usePathname(); // Obtendo o caminho atual

    return (
        <header className="bg-slate-950">
            <div className="flex mx-24 justify-between">
                <Link href="/" className="flex items-center justify-start h-16">
                    <GraduationCap className="text-white mr-3 " />
                    <h1 className="text-white text-xl">Academia FSLab</h1>
                </Link>

                {/* Verifica se a rota atual é diferente de /login */}
                {pathname !== '/login' && (
                    <Link className="content-center" href="/login">
                        <p className="text-white">Logar/Cadastrar</p>
                    </Link>
                )}
            </div>
        </header>
    );
}
