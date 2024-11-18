import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
    return (
        <header className="bg-slate-950">
            <div className="container mx-24 px-4">
                <Link href="/" className="flex items-center justify-start h-16">
                    <GraduationCap className="text-white mr-3 " />
                    <h1 className="text-white text-xl">Academia FSLab</h1>
                </Link>
            </div>
        </header>
    );
}