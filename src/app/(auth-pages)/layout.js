import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LayoutNoAuth({ children }) {

  const session = await getServerSession(authOptions);

  console.log(session)

  if (session?.token) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-grow mx-24 my-4">
        {children}
      </main>
      <Footer />
      <ReactToastContainer />
    </div>
  );
}
