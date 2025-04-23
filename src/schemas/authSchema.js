import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class authSchema{
    static logar = z.object({
        email: myZ.email(),
        senha: myZ.senha()
    })
    static cadastrar = z.object({
        "nome": z.string().min(3).max(200),
        "new-email": myZ.email(),
        "new-senha": myZ.senha()
    })
}