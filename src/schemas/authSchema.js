import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class authSchema{
    static logar = z.object({
        email: myZ.email(),
        senha: myZ.senha()
    })
}