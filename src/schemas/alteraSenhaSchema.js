import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class alteraSenhaSchema{
    static alterar = z.object({
        senha: myZ.senha(),
        confirmarSenha: z.string(),
        email: myZ.email(),
        token: z.string()
    }).superRefine((data, ctx) => {
        if (data.senha !== data.confirmarSenha) {
            ctx.addIssue({
                code: "custom",
                message: "As senhas devem coincidir!",
                path: ["confirmarSenha"], 
            });
        }
    });
}