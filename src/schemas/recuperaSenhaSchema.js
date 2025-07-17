import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class recuperarSenhaSchema {
    static recuperar = z.object({
        email: myZ.email()
    })
}