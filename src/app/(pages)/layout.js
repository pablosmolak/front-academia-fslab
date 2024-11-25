import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ApplicationProvider } from "@/src/context/applicationContext";

export default async function LayoutNoAuth({ children }) {
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
