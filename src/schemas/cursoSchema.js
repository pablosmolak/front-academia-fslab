import { applyZodInitialConfig, myZ } from "../utils/zod"
import { z } from "zod"

applyZodInitialConfig()

export class cursoSchema{
    static filtrarCurso = z.object({
        filtro: z.string().optional(),
        pagina: z.string().optional(),
        limite: z.string().optional()
    })
}