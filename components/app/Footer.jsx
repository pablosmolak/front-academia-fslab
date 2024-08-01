import Image from "next/image";
import Logo from "../../public/assets/logoIfro.png";


export default function Footer() {

    const LogoIfro = Logo;
    return (
        <footer className="bg-gray-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-end h-48">
                    <div className="mr-6">
                        <p className="text-black font-semibold">IFRO - Instituto Federal de Rondônia</p>
                        <p className="text-black">Av. Lauro Sodré, 6500 - Censipam - Aeroporto, Porto Velho - RO, 76803-260</p>
                        <p className="text-black">Fone/Fax: (69) 2182-9600</p>
                    </div>
                    <Image src={LogoIfro} alt="Logo" width={90} height={112} />
                </div>
            </div>
        </footer>
    );
} 