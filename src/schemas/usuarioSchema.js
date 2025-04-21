import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class usuarioSchema {
    static alterarUsuario = z.object({
        nome: z.string().min(3).max(50).optional(),
        email: myZ.email().optional(),
       // senha: myZ.senha().optional()
    })
}