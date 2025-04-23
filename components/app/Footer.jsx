import Image from "next/image";
import Link from "next/link";
import LogoIfro from "@/public/assets/logoIfroHorizontal.png";
import logoFSLab from "@/public/assets/logo_fslab.svg";
import { Instagram, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-300 text-gray-800 py-3">
            <div className="px-4 xl:px-36 mx-auto px-4 flex flex-col gap-2">

                {/* Logos */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6">
                <div className="flex gap-6">
                        <Image
                            src={logoFSLab}
                            alt="Logo FSLAB"
                            className=" w-20 sm:w-24"
                        />
                        <Image
                            src={LogoIfro}
                            alt="Logo IFRO"
                            className=" w-32 sm:w-36"
                        />
                    </div>
                    <div className="flex gap-4 text-2xl">
                        <a
                            href="https://instagram.com/fslab.vilhena"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-gray-700 transition-colors"
                        >
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
                <div className="border-t border-gray-400 pt-4 text-center text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© 2025 Academia FSLab | Todos os direitos reservados</p>
                    <div className="flex gap-4">
                        <Link href="/termos" className="hover:underline">
                            Termos de Uso
                        </Link>
                        <a
                            href="https://github.com/pablosmolak"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Criado por Pablo Smolak
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}