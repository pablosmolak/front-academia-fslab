export function createURLSearch(route, data) {

  let searchParams = new URLSearchParams();

  const querys = data?.querys ? data.querys : data;
  const hiddenQuerys = data?.hiddenQuerys;
  const schema = data?.schema;

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
      if ((schema?.shape[query])) {
        searchParams.set(query, value);
      }

    } else {
      searchParams.set(query, value);
    }
  }

  // Adicionar as querys ocultas;
  if (hiddenQuerys) {
    for (let query in hiddenQuerys) {
      let value = hiddenQuerys[query];

      // verificar se a query é vazia, undefined, null ou all, o all é porque o shadcnui não recebe string vazia nas options ai o all serve para dizer que seria todas as opções;
      if (value === undefined || value === "" || value === null || value === "all") {

        if (searchParams.has(query)) {
          searchParams.delete(query);
        }

        continue;
      }

      searchParams.set(query, value);
    }
  }

  return `${route}?${searchParams}`;
}