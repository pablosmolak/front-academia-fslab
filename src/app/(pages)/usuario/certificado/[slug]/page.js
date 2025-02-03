"use client"

import ButtonLoading from "@/components/buttonLoading";
import Certificado from "@/components/certificado/certificado";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useState } from "react";

export default function certificadoPage({ params }) {

    const certificadoid = params.slug

    const [loadindBaixarCertificado, setLoadindBaixarCertificado] = useState(false);

    // const {
    //     data: certificado,
    //     isLoading: isLoadingCertificado,
    //     isError: isErrorCertificado,
    //     error: errorCertificado
    // } = useQuery({
    //     queryKey: ["getCertificado", certificadoid],
    //     queryFn: async () => {
    //         const response = await fetchApi(`/certificados/validar/${certificadoid}`, "GET");

    //         if (response.error) {
    //             throw response.errors;
    //         } else {
    //             return response.data[0]
    //         }
    //     }
    // })

    const certificado = {
        usuario: {
            nome: "Pablo Smolak"
        },
        curso: {
            nome: "Introdução a docker",
            cargaHoraria: "1h30m"
        }
    }

    const handlePrint = () => {
        setLoadindBaixarCertificado(true);
        const certificado = document.getElementById("certificado");

        const width = certificado.offsetWidth;
        const height = certificado.offsetHeight;

        let scale

        if (width === 800 && height === 566) {
            scale = 3;
        }
        else if (width === 400 && height === 283) {
            scale = 5;
        } else {
            scale = 6;
        }
        const options = {
            quality: 1, // Qualidade máxima
            pixelRatio: scale, // Escala maior para melhor qualidade
        };

        toPng(certificado, options).then((dataUrl) => {
            const pdf = new jsPDF("landscape", "px", "a4");
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Adicionar a imagem do certificado ao PDF
            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "SLOW");

            const linkUrl = "https://academia.app.fslab.dev/usuario/certificado/dcceaded-f3d6-4760-a5e6-723e79c7966e";

            // Configurações do link
            const fontSize = 8;
            const marginRight = 13;
            const marginBotton = 5;

            const textWidth = pdf.getStringUnitWidth(linkUrl) * fontSize / pdf.internal.scaleFactor;

            const positionRight = pdfWidth - textWidth - marginRight;
            const positionBotton = pdfHeight - marginBotton;


            pdf.setFontSize(fontSize);
            pdf.setTextColor(0, 0, 0);
            pdf.text(linkUrl, positionRight, positionBotton, { url: linkUrl });

            pdf.save("certificado.pdf");

            setLoadindBaixarCertificado(false);
        });
    };


    return (
        <div className="text-center ">
            <h1>Certificado de conclusão</h1>
            <div id="teste" className="flex justify-center">
                <Certificado certificado={certificado} />
            </div>
            <ButtonLoading
                onClick={() => { handlePrint() }}
                isLoading={loadindBaixarCertificado}
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
            </ButtonLoading>

            <a href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Curso%20de%20JavaScript&organizationName=Academia%20FSLab&issueYear=2025&issueMonth=1&certId=12345&certUrl=https://www.example.com/certificates/12345"
                target="_blank"
                className="bg-[#0073b1] text-white "
            // style="background-color: #0073b1; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;"
            >
                Incluir certificado no LinkedIn
            </a>

        </div>
    );
}