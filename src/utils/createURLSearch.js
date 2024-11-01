// Função para criar link juntando a rota com as querys. ex: /reservas?motorista=id&veiculo=id&filtro=aberto;
export function createURLSearch(route, querys, schema) {

    let searchParams = new URLSearchParams();
  
    for (let query in querys) {
  
      let value = querys[query];
  
      // verificar se a query é vazia, undefined, null ou all, o all é porque o shadcnui não recebe string vazia nas options ai o all serve para dizer que seria todas as opções;
      if (value === undefined || value === "" || value === null || value === "all") {
  
        if (searchParams.has(query)) {
          searchParams.delete(query);
        }
  
        continue;
      }
  
      if (schema) {
        if (schema?.shape[query]) {
          searchParams.set(query, value);
        }
      } else {
        searchParams.set(query, value);
      }
  
    }
  
    return `${route}?${searchParams}`;
  }
  