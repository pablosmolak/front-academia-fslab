import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class usuarioSchema {
    static alterarUsuario = z.object({
        nome: z.string().min(3).max(50).optional(),
        email: myZ.email().optional(),
        senha: z.preprocess(
            (val) => val === '' ? undefined : val,
            myZ.senha().optional()
        ),
        confirmaSenha: z.string()
    }).superRefine((data, ctx) => {
        if (data.senha !== undefined && data.senha !== data.confirmaSenha) {
            ctx.addIssue({
                code: "custom",
                message: "As senhas devem coincidir!",
                path: ["confirmaSenha"],
            });
        }
    });
}