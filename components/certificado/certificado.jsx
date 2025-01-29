import Image from "next/image";
import React from "react";

export default function Certificado({ certificado }) {
    return (
        <section className=" w-[320px] h-[226px] sm:w-[400px] sm:h-[283px] lg:w-[800px] lg:h-[566px]">
            <div
                id="certificado"
                className="
            bg-[linear-gradient(180deg,#FAFBF6,#EAEDDC)]
            text-center 
            font-sans relative
            p-[6.4px] sm:p-[8px] lg:p-[16px]
            "
            >
                <div className="border-[1.6px] sm:border-[2px] lg:border-[4px] border-green-700 border-dashed h-[213.2px] sm:h-[267px] lg:h-[534px]">

                    <div className="flex justify-between mb-5">
                        <img src="/assets/governo.png" className="w-[30px] h-[30px] sm:w-[37px] sm:h-[38px] lg:w-[59px] lg:h-[60px]"/>
                        <h3 className="text-[5.6px] sm:text-[7px] lg:text-[14px] m-0">
                            GOVERNO FEDERAL
                            <br />
                            MINISTÉRIO DA EDUCAÇÃO
                            <br />
                            INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA
                            <br />
                            CAMPUS VILHENA
                        </h3>
                        <img src="/assets/logoIfro.png" className="w-[24px] sm:w-[30px] lg:w-[60px]"/>
                    </div>
                     
                    <h1 className="font-bold text-[8px] sm:text-[10px] lg:text-[20px] my-5">CERTIFICADO DE CONCLUSÃO</h1>
                    <p className="text-[5.6px] sm:text-[7px] lg:text-[14px]
                    p-[6.4px] sm:p-[8px] lg:px-[64px]

                    text-justify
                    ">
                        Certificamos para os devidos fins que{" "}
                        <strong>{certificado?.usuario.nome}</strong> concluiu o curso{" "}
                        <strong>{certificado?.curso.nome}</strong>, ofertado pelo Laboratório de Fábricas de
                        Software (FSLab) - INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA
                        DE RONDÔNIA - CAMPUS VILHENA, com carga horária de{" "}
                        <strong>{certificado?.curso.cargaHoraria}</strong>.
                    </p>
                    {/* <div className="flex justify-end mt-10">
                        <div className="text-center">
                            <p>Instrutor</p>
                            <p>
                                <strong>Marco Antonio</strong>
                            </p>
                        </div> *

                    </div>
                    {/* <div className="mt-5 text-center">
                        <Image src="/assets/logo_fslab.jpeg" width={100} height={100} className="w-24 mx-auto" />
                    </div> */}
                </div>
            </div>
        </section>
    );
};
