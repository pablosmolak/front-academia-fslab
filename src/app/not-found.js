import Footer from '@/components/app/Footer';
import TopBar from '@/components/app/TopBar';
import Link from 'next/link';


export default function Custom404({ showLayout = true }) {
    const content = (

        <div
            className="
            w-full
                text-center 
                 px-4 xl:px-36 
            "
        >
            <div className="flex-grow flex flex-col items-center justify-center text-gray-900 px-4 py-16">
                <div className="w-full text-center">
                    <h1 className="text-[10rem] font-bold text-yellow-500 leading-none">404</h1>
                    <h2 className="text-3xl font-bold mb-4">A página que você está procurando não existe.</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Não se preocupe, isso acontece com todo mundo! <br />
                        Parece que você encontrou uma rua sem saída.
                    </p>
                    <Link href="/" passHref>
                        <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold px-6 py-3 rounded-xl transition duration-200">
                            Voltar para o início
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );

    if (!showLayout) return content;

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <div className="flex-grow">{content}</div>
            <Footer />
        </div>
    );
}

