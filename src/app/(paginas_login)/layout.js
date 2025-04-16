import Footer from "@/components/app/Footer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LayoutNoAuth({ children }) {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/")
    }

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-grow py-8 px-4 xl:px-36 flex-grow  flex  items-center  justify-center">
                {children}
            </main>
            <Footer />
        </div>
    );
}


