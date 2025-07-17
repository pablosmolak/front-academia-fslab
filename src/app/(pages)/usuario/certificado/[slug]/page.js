"use client"

import ButtonLoading from "@/components/buttonLoading";
import Certificado from "@/components/certificado/certificado";
import { Skeleton } from "@/components/ui/skeleton";
import Custom404 from "@/src/app/not-found";
import { ApplicationContext } from "@/src/context/applicationContext";
import { fetchApi } from "@/src/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";

export default function certificadoPage({ params }) {

    const [loadindBaixarCertificado, setLoadindBaixarCertificado] = useState(false);
    const certificadoid = params.slug

    const { data: session } = useSession({
        required: false,
        refetchInterval: 30,
    });

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
                throw response;
            } else {
                return response.data[0]
            }
        }
    })

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

            const linkUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}/usuario/certificado/${certificadoid}`;

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

    function gerarLinkCertificadoLinkedIn(nomeCurso, data, idDoCertificado, url) {
        const baseUrl = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";

        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = dataObj.getMonth() + 1;

        const params = new URLSearchParams({
            name: nomeCurso,
            organizationName: "Academia FSLab",
            issueYear: ano.toString(),
            issueMonth: mes.toString(),
            certId: idDoCertificado.toString(),
            certUrl: url,
        });

        return `${baseUrl}&${params.toString()}`;
    }

    const ehDonoDoCertificado = certificado?.usuario.id === session?.user.id

    if (!isLoadingCertificado && isErrorCertificado) {
        return (
            <Custom404 showLayout={false} />
        )
    }

    if (!isLoadingCertificado && !isErrorCertificado) {
        return (
            <div
                className="
                    text-center 
                    py-8  xl:px-36 
                ">
                <h1 className="
                     text-lg xl:text-2xl 
                     pb-8 font-semibold
                ">
                    Certificado de conclusão
                </h1>

                <div className="flex justify-center">
                    <Certificado certificado={certificado} />
                </div>
                {ehDonoDoCertificado && (
                    <div className="
                    flex
                    flex-col md:flex-row
                    items-center
                    justify-center 
                    py-8 px-4 xl:px-36
                    gap-4
                    w-full
                    ">
                        <ButtonLoading
                            onClick={() => { handlePrint() }}
                            isLoading={loadindBaixarCertificado}
                            className="
                            w-64 
                            h-10
                            "
                        >
                            Baixar certificado
                        </ButtonLoading>

                        <a
                            href={
                                gerarLinkCertificadoLinkedIn(
                                    certificado?.curso.nome,
                                    certificado?.created_at,
                                    certificadoid,
                                    `${process.env.NEXT_PUBLIC_FRONT_URL}/usuario/certificado/${certificadoid}`
                                )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                flex
                              items-center
                              justify-center
                                w-64 
                                h-10
                                gap-2 
                                bg-[#0077b5] 
                                hover:bg-[#005983] 
                                text-white 
                                rounded-md 
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.2 8.29h4.63V24H.2zM7.56 8.29h4.43v2.13h.06c.62-1.17 2.13-2.4 4.39-2.4 4.7 0 5.56 3.09 5.56 7.1V24h-4.64v-7.5c0-1.79-.03-4.08-2.49-4.08-2.49 0-2.87 1.94-2.87 3.95V24H7.56z" />
                            </svg>
                            Compartilhar no LinkedIn
                        </a>


                    </div>
                )}


            </div>
        );
    }


    if (isLoadingCertificado && !isErrorCertificado) {

        return (
            <>
                <div className="text-center py-8  xl:px-36 ">

                    <h1 className="
                      text-lg xl:text-2xl 
                      pb-8 font-semibold
                    ">
                        Certificado de conclusão
                    </h1>
                    <div className="flex justify-center">
                        <Skeleton className="w-[320px] h-[226px] sm:w-[400px] sm:h-[283px] lg:w-[800px] lg:h-[566px]" />
                    </div>
                </div>
            </>
        )

    }
}