import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class verificaEmailSchema{
    static verificarEmail = z.object({
        codigoVerificacaoEmail: z
            .string()
            .refine(value => value.toString().length === 6, {
                message: "O código deve ter 6 dígitos.",
            }),
    });
}