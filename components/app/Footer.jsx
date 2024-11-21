import Image from "next/image";
import Logo from "../../public/assets/logoIfro.png";

export default function Footer() {

    const LogoIfro = Logo;
    return (
        <footer className="bg-gray-300">
            <div className="mx-24">
                <div className="flex items-center justify-end h-24">
                    <div className="mr-6">
                        <p className="text-black font-semibold">IFRO - Instituto Federal de Rondônia</p>
                        <p className="text-black">Av.  Brigadeiro Eduardo Gomes, 5218 - Jardim Eldorado, Vilhena - RO, 76980-000</p>
                        <p className="text-black">Fone/Fax: (69) 2101-0700</p>
                    </div>
                    <Image src={LogoIfro} alt="Logo" width={60} height={100} />
                </div>
            </div>
        </footer>
    );
}
