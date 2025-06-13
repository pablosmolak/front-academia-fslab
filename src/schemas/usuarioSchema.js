import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class usuarioSchema {
    static alterarUsuario = z
        .object({
            nome: z.string().min(3).max(50).optional(),
            email: myZ.email().optional(),
            alterarSenha: z.boolean().optional(),
            senha: z.preprocess(
                (val) => val === '' ? undefined : val,
                myZ.senha().optional()
            ),
            confirmaSenha: z.string().optional()
        })
        .superRefine((data, ctx) => {
            if (data.alterarSenha) {
                if (!data.senha) {
                    ctx.addIssue({
                        code: "custom",
                        message: "A senha é obrigatória.",
                        path: ["senha"],
                    });
                }

                if (!data.confirmaSenha) {
                    ctx.addIssue({
                        code: "custom",
                        message: "A confirmação da senha é obrigatória.",
                        path: ["confirmaSenha"],
                    });
                }

                if (data.senha && data.senha !== data.confirmaSenha) {
                    ctx.addIssue({
                        code: "custom",
                        message: "As senhas devem coincidir!",
                        path: ["confirmaSenha"],
                    });
                }
            }
        });
}
