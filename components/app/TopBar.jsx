"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { GraduationCap } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Usando o hook correto
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { useContext } from "react";
import { ApplicationContext } from "@/src/context/applicationContext";


export default function TopBar({ className }) {
    const pathname = usePathname(); // Obtendo o caminho atual
    const router = useRouter();

    const { data: session, status } = useSession({
        required: false,
        refetchInterval: 60,
    });

    const { user:userContext } = useContext(ApplicationContext);
    return (
        <header
            className={`
                bg-slate-950
                px-4 xl:px-36
                gap-4 xl:gap-4
                ${className}`
            }
        >
            <div
                className="
                flex
                justify-between
                "
            >
                <Link href="/" className="flex items-center justify-start h-16">
                    <GraduationCap className="text-white mr-3 " />
                    <h1 className="text-white text-xl">Academia FSLab</h1>
                </Link>

                {/* Verifica se a rota atual é diferente de /login */}
                {pathname !== '/login' && status === "unauthenticated" && (
                    <Link className="content-center" href="/login">
                        <p className="text-white">Login</p>
                    </Link>
                )}
                {pathname !== '/login' && status === "authenticated" && (
                    <DropdownMenu className="">
                        <DropdownMenuTrigger asChild>
                            <div className="flex flex-row items-center gap-x-2">
                                <Avatar >
                                    <AvatarImage src={userContext?.fotoPerfilUrl} />
                                    <AvatarFallback>{userContext?.name?.trim().slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Label className="text-white hidden sm:inline">{
                                    userContext?.name?.split(" ")
                                        .filter(word => !["da", "de", "do", "das", "dos"].includes(word.toLowerCase()))
                                        .slice(0, 2)
                                        .join(" ")
                                }</Label>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => { router.push("/usuario/meuperfil") }}>
                                    Meu Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { signOut() }}>
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}

