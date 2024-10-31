import { GraduationCap } from "lucide-react";

export default function TopBar() {
    return (
        <header className="bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-start h-28"> 
                    <GraduationCap className="text-white mr-3 " />
                    <h1 className="text-white text-xl">Academia FSLab</h1>
                </div>
            </div>
        </header>
    );
}