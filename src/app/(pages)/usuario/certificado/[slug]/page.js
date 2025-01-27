"use client"

import Certificado from "@/components/certificado/certificado";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function certificadoPage({ params }) {

    const certificadoid = params.slug

    const {
        data: certificado,
        isLoading: isLoadingCertificado,
        isError: isErrorCertificado,
        error: errorCertificado
    } = useQuery({
        queryKey: ["getCertificado", certificadoid],
        queryFn: async () => {
            const response = await fetchApi(`/certificados/validar/${certificadoid}`, "GET");

            if (response.error) {
                throw response.errors;
            } else {
                return response.data[0]
            }
        }
    })

    const handlePrint = () => {
        const certificado = document.getElementById("certificado");

        // Aumentar a escala para melhorar a qualidade da imagem
        const scale = 4; // Aumentar o valor se necessário
        const options = {
            quality: 1, // Qualidade máxima
            pixelRatio: scale, // Escala maior para melhor qualidade
        };

        toPng(certificado, options).then((dataUrl) => {
            const pdf = new jsPDF("landscape", "px", "a2");
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("certificado.pdf");
        });
    };
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h1>Certificado de conclusão</h1>
                <div>
                    <Certificado certificado={certificado} />
                </div>
                <button
                    onClick={() => { handlePrint() }}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#FFC107",
                        color: "#000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Baixar certificado
                </button>
            </div>
        );
}