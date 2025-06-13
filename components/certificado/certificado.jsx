import { dataPorExtenso, transformarEmFormatoCompacto } from "@/src/utils/mascaras";

export default function Certificado({ certificado }) {
    return (
        <section className="w-[320px] h-[226px] sm:w-[400px] sm:h-[283px] lg:w-[800px] lg:h-[566px]">
            <div
                id="certificado"
                className="
                    bg-[linear-gradient(180deg,#FAFBF6,#EAEDDC)]
                    text-center 
                    font-sans relative
                    p-[6.4px] sm:p-[8px] lg:p-[16px]
                "
            >
                <div 
                    className="
                        border-[1.6px] sm:border-[2px] lg:border-[4px] 
                        border-green-700 border-dashed 
                        h-[213.2px] sm:h-[267px] lg:h-[534px]
                    "
                >
                    <div
                        className="
                            flex justify-between 
                            px-[12px] pt-[4px] sm:px-[15px] sm:pt-[5px] lg:px-[30px] lg:pt-[10px]
                        "
                    >
                        <img src="/assets/governo.png"
                            className="w-[30px] h-[30px] sm:w-[37px] sm:h-[38px] lg:w-[59px] lg:h-[60px]"
                        />
                        <h3 className="text-[5.6px] sm:text-[7px] lg:text-[14px] m-0">
                            GOVERNO FEDERAL
                            <br />
                            MINISTÉRIO DA EDUCAÇÃO
                            <br />
                            INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA
                            <br />
                            CAMPUS VILHENA
                        </h3>
                        <img src="/assets/logoIfro.png" className="w-[24px] sm:w-[30px] lg:w-[60px]" />
                    </div>

                    <h1 className="font-bold 
                    text-[9.6px] sm:text-[12px] lg:text-[24px] 
                    mt-[22px] mb-[14px] sm:mt-[27,5px] sm:mb-[17,5px] lg:mt-[55px] lg:mb-[35px]">
                        CERTIFICADO DE CONCLUSÃO
                    </h1>

                    <p className="text-[6.4px] sm:text-[8px] lg:text-[16px] 
                    px-[25.6px] sm:px-[32px] lg:px-[64px]
                    text-justify
                    ">
                        Certificamos para os devidos fins que{" "}
                        <strong>{certificado?.usuario.nome}</strong> concluiu o curso{" "}
                        <strong>{certificado?.curso.nome}</strong> na data de <strong>{dataPorExtenso(certificado?.created_at)}</strong>, ofertado pelo Laboratório de Fábricas de
                        Software (FSLab) - INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA
                        DE RONDÔNIA - CAMPUS VILHENA, com carga horária de{" "}
                        <strong>{transformarEmFormatoCompacto(certificado?.curso.cargaHoraria)}</strong>.
                    </p>
                    <section className="flex justify-center
                    pt-[40px] px-[25.6px] sm:pt-[50px] sm:px-[32px] lg:pt-[100px] lg:px-[64px]
                    h-[67.2px] sm:h-[84px] lg:h-[168px]"
                    >
                        <div className="text-center">
                            <img src="/assets/logo_fslab.svg" className="w-[60.8px] h-[29.6px] sm:w-[76px] sm:h-[37px] lg:w-[152px] lg:h-[74px]" />
                        </div>
                        {/* <div className="flex flex-col items-center w-[100px] sm:w-[125px] lg:w-[250px]">
                            <img src="/assets/assinaturaExemplo.png"
                                className="w-[60.8px] h-[18px] sm:w-[76px] sm:h-[22.5px] lg:w-[152px] lg:h-[45px]"
                            />
                            <div className="flex flex-col content-between border-t-2 border-black 
                            w-[100px] sm:w-[125px] lg:w-[250px]
                            h-[17.2px] sm:h-[21.5px] lg:h-[43px]
                            ">
                                <strong
                                    className="text-[5.6px] sm:text-[7px] lg:text-[14px]">
                                    Marco Antonio
                                </strong>
                                <p
                                    className="text-[4.8px] sm:text-[6px] lg:text-[12px]">
                                    Coordenador do FSLab
                                </p>
                            </div>
                        </div> */}
                    </section>
                </div>
            </div>
        </section>
    );
};