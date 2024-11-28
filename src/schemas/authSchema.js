import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class authSchema{
    static logar = z.object({
        email: myZ.email(),
        senha: myZ.senha()
    })

    static recuperarSenha = z.object({
        email: myZ.email(),   
    });

    static cadastrar = z.object({
        email: myZ.email(),
        senha: myZ.senha(),
        confirmarSenha: z.string(),
        nome: z.string().min(3).max(200)
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