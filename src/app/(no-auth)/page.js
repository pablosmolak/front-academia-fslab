"use-client"

import CardsCursos from "@/components/paginaInicial/cards"

export default function paginaInicial(){
    return(
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1rem",
            margin:"1rem 4rem"
        }}>
            <CardsCursos dados={["1","2","3","1","2","3","1","2","3","1","2","3","1","2","3","1","2","3","1","2","3"]}></CardsCursos>
        </div>
        

        
    )
}