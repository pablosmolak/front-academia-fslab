"use client";

import { ApplicationContext } from "@/src/context/applicationContext";
import getCroppedImg from "@/src/utils/cropImage";
import { fetchApi } from "@/src/utils/fetchApi";
import { handleImagePath } from "@/src/utils/handleImagePath";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Pen } from "lucide-react";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function InputFoto({
    value,
    onChange,
    acceptTypes = [".webp", ".jpeg", ".png", ".jpg"],
    id,
    usuario,
}) {
    const queryClient = useQueryClient();
    const refInputFile = useRef();
    const { setUser } = useContext(ApplicationContext);

    const [isPending, startTransition] = useTransition();

    const [photo, setPhoto] = useState(() => {
        if (value) return { url: value };
        return undefined;
    });

    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    function filePreview(file) {
        if (file.type.includes("image")) {
            return URL.createObjectURL(file);
        }
    }

    function validateType(e) {
        const file = e.target.files[0];

        if (file) {
            if (acceptTypes.length > 0) {
                let [, tipo] = file.type.split("/");

                if (acceptTypes.includes("." + tipo)) {
                    openCropModal(file);
                } else {
                    toast.error("Os formatos aceitos são: " + acceptTypes.join(" "));
                    return;
                }
            } else {
                openCropModal(file);
            }
        }
    }

    function openCropModal(file) {
        const preview = filePreview(file);
        setCropImageSrc(preview);
        setCurrentFile(file);
        setCropModalOpen(true);

        if (refInputFile.current) {
            refInputFile.current.value = null;
        }

        setZoom(1)
    }

    async function handleCropConfirm() {
        const croppedImgUrl = await getCroppedImg(cropImageSrc, croppedAreaPixels);

        const blob = await fetch(croppedImgUrl).then((res) => res.blob());

        // ✅ Validação de tamanho (5MB = 5 * 1024 * 1024 bytes)
        const maxSizeInBytes = Number(process.env.NEXT_PUBLIC_LIMITE_UPLOAD_ARQUIVOS) * 1024 * 1024;
        if (blob.size > maxSizeInBytes) {
            toast.error(`O tamanho da imagem recortada ultrapassa o limite de ${process.env.NEXT_PUBLIC_LIMITE_UPLOAD_ARQUIVOS}MB. Tente escolher uma imagem menor ou ajustar o recorte.`);
            return;
        }

        const croppedFile = new File([blob], currentFile.name, { type: currentFile.type });

        const image = {
            file: croppedFile,
            nome: croppedFile.name,
            preview: URL.createObjectURL(croppedFile),
            url: null,
        };

        setPhoto(image);
        setCropModalOpen(false);
        processUpload(image);
        setCurrentFile(null)
    }


    function processUpload(file) {
        startTransition(async () => {
            const data = new FormData();
            data.append("file", file.file, file.nome);

            await fetchApi(`/usuarios/${usuario?.id}/image/upload`, "POST", data)
                .then((response) => {
                    if (response.error) throw response;

                    const fotoPerfilUrl = handleImagePath(`/usuarios/${usuario?.id}/image?time=${Date.now()}`)

                    setUser((prevUser) => ({
                        ...prevUser, // Mantém as propriedades existentes
                        fotoPerfilUrl
                    }));

                    setPhoto({
                        ...file,
                        url: fotoPerfilUrl,
                    });

                    queryClient.invalidateQueries(["meuperfil", usuario?.id]);

                    onChange(fotoPerfilUrl);
                })
                .catch((error) => {
                    setPhoto();
                    onChange(null);
                    error.errors?.forEach((error) => toast.error(error));
                });
        });
    }

    async function removePhoto() {
        await fetchApi(`/usuarios/${usuario?.id}/image/delete`, "DELETE").then((response) => {

            if (response.error) throw response;

            setUser((prevUser) => ({
                ...prevUser, // Mantém as propriedades existentes
                fotoPerfilUrl: handleImagePath(`/usuarios/${usuario?.id}/image?time=${Date.now()}`)
            }));

            setPhoto();
            onChange(null);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if (!value) setPhoto();
    }, [value]);

    return (
        <div
            className="
                relative flex 
                justify-center 
                items-center 
                flex-col
                gap-2
            "
        >
            <div
                className={`
                    flex 
                    justify-center 
                    items-center 
                    w-[200px] h-[200px] 
                    border rounded-full 
                    overflow-hidden 
                    relative 
                    ${!photo?.url && "hover:cursor-pointer"}
                    `
                }
                tabIndex={!photo?.url ? 0 : -1}
                aria-label={!photo?.url ? "Adicionar foto" : "Editar foto"}
                onClick={() => {
                    if (!photo?.url) {
                        refInputFile?.current?.click();
                    }
                }}
                title={!photo?.url ? "Adicionar foto" : ""}
            >
                <label className="hidden" htmlFor="foto">
                    Adicionar foto
                </label>
                <input
                    id={id}
                    type="file"
                    ref={refInputFile}
                    className="hidden"
                    onChange={(e) => validateType(e)}
                    accept={acceptTypes}
                />

                {(photo?.preview || photo?.url) && (
                    <img
                        className={`object-cover w-full h-full ${!photo?.url ? "opacity-70" : ""}`}
                        src={photo?.preview || handleImagePath(`/usuarios/${usuario?.id}/image`)}
                    />
                )}

                {photo?.preview && !photo?.url && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin absolute" />
                )}

                {!photo?.preview && !photo?.url && (
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-sm">Adicione uma foto</span>
                    </div>
                )}
            </div>

            <div>
                {photo?.url && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Editar foto"
                                className="flex gap-1 h-10 w-auto p-2"
                                disabled={isPending}
                                type="button"
                                variant="outline"
                            >
                                <span className="sr-only">Editar foto</span>
                                <Pen className="w-3" />
                                Editar imagem
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => refInputFile?.current?.click()}>
                                Alterar imagem
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={removePhoto}>Remover imagem</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <AlertDialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
                <AlertDialogContent className="max-w-2xl w-[90vw] h-[80vh] flex flex-col">
                    <AlertDialogTitle className="hidden"></AlertDialogTitle>
                    <div className="relative flex-1">
                        <Cropper
                            key={cropImageSrc}
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, croppedArea) => setCroppedAreaPixels(croppedArea)}
                        />
                    </div>
                    <AlertDialogFooter className="flex gap-2">
                        <Button variant="ghost" onClick={() => setCropModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCropConfirm}>
                            Cortar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>



            {/* {cropModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                    <div className="relative bg-white w-[90vw] max-w-2xl h-full rounded shadow-lg p-4 flex flex-col items-center">
                        <div className="relative w-full h-full">
                            <Cropper
                                image={cropImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedArea) => setCroppedAreaPixels(croppedArea)}
                            />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="ghost" onClick={() => setCropModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleCropConfirm}>
                                Cortar
                            </Button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}