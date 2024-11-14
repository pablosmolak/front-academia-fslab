import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Academia FSLab",
  description: "Projeto Fabrica de Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <ReactQueryProvider>
        <body className={inter.className}>{children}</body>
      </ReactQueryProvider>
    </html>
  );
}
