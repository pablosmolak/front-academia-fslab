import Image from "next/image";
import React from "react";

export default function Certificado({ certificado }) {
    return (
        <section className="w-[800px] h-[800px]">

            <div
                id="certificado"
                className="
            bg-[linear-gradient(180deg,#FAFBF6,#EAEDDC)]
            text-center 
            font-sans relative 
            p-4
            "
            >
                <div className="border-4 border-green-700 border-dashed p-2">

                    <div className="mb-5">
                        <h3 className="font-normal m-0">
                            GOVERNO FEDERAL
                            <br />
                            MINISTÉRIO DA EDUCAÇÃO
                            <br />
                            INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA
                            <br />
                            CAMPUS VILHENA
                        </h3>
                    </div>
                    <h1 className="text-xl my-5">CERTIFICADO DE CONCLUSÃO</h1>
                    <p className="text-lg leading-6">
                        Certificamos para os devidos fins que{" "}
                        <strong>{certificado?.usuario.nome}</strong> concluiu o curso{" "}
                        <strong>{certificado?.curso.nome}</strong>, ofertado pelo Laboratório de Fábricas de
                        Software (FSLab) - INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA
                        DE RONDÔNIA CAMPUS VILHENA, com carga horária de{" "}
                        <strong>15 horas</strong>.
                    </p>
                    <div className="flex justify-end mt-10">
                        <div className="text-center">
                            <p>Instrutor</p>
                            <p>
                                <strong>Marco Antonio</strong>
                            </p>
                        </div>

                    </div>
                    <div className="mt-5 text-center">
                        <Image src="/assets/logoifro.png" width={100} height={100} className="w-24 mx-auto" />
                    </div>
                </div>
            </div>
        </section>
    );
};
