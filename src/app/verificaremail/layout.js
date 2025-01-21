import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LayoutNoAuth({ children }) {
    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/login")
    }

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-grow mx-28 my-4 content-center">
                {children}
            </main>
            <Footer />
            <ReactToastContainer />
        </div>
    );
}
