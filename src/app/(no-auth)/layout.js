import Footer from "@/components/app/Footer";
import ReactToastContainer from "@/components/app/ReactToastContainer";
import TopBar from "@/components/app/TopBar";

export default function LayoutNoAuth({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ReactToastContainer />
    </div>
  );
}
