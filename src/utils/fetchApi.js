import { createURLSearch } from "./createURLSearch";
//import { getSessionClient } from "./getSessionClient";
//import { getSessionServer } from "./getSessionServer";

// Função para verificar se onde a função está sendo chamada esta do lado do servidor ou esta do lado do cliente
const verificarRenderizacao = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL;
  } else {
    // "use server";

    return process.env.API_URL;
  }
}

const getSessionSafely = async () => {
  if (typeof window !== "undefined") {
    return //await getSessionClient();
  } else {
    "use server";

    return //await getSessionServer();
  }
}

// Função fetchApi criada para garantir que todas requisições passem por aqui, garantir mesmo retorno e facilitar as validações em um único lugar

// se o método for get os dados serão querys (params) se não será dados mesmo tipo body para post ou patch etc...
export const fetchApi = async (route, method, data, ...props) => {
  try {
    // 
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmYTM3YzA1LTIzOTctNGRlMS04NGZmLTBhYjFiYzYyYWRjYyIsIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZW1haWwiOiJkZXZAZ21haWwuY29tIiwiYXRpdm8iOnRydWUsImdydXBvIjoiQWRtaW5pc3RyYWRvcmVzIiwiaWF0IjoxNzMxMTgzOTY3LCJleHAiOjE3MzEyNzAzNjd9.Tf6ziDNXyQz4wdyeu9DWvQBQo2guNRoTiA3xFHhWXB4"//await getSessionSafely();

    // chama função para pegar o env da API
    let urlApi = verificarRenderizacao();

    let dados = null;

    // se for método GET recebe as querys e cria uma URL já com encode
    if (method === "GET" && data) {
      if (data?.searchParams && data?.schema) {

        let urlSearch = createURLSearch(route, data.searchParams, data?.schema);
        route = urlSearch;

      } else {
        let urlSearch = new URLSearchParams(data);
        route = `${route}?${urlSearch}`;
      }

      // Perguntar para o Mateus como lidar com isso
    }

    let headers = {
      "Authorization": `Bearer ${token}`,
      "accept": "application/json"
    }

    if (method !== "GET" && data) {
      if (data instanceof FormData) {
        // Se os dados forem uma instância de FormData (envio de arquivos)
        headers["accept"] = "multipart/form-data";
        dados = data;
      } else {
        // Caso contrário, assume-se que são dados JSON
        headers["Content-Type"] = "application/json";
        dados = JSON.stringify(data);
      }
    }

    const response = await fetch(`${urlApi}${route}`, {
      method: method,
      headers: headers,
      body: dados,
      cache: "no-store",
      ...props
    })

    const responseData = await response.json();

    // se erro retorna o array de dados vazio
    if (responseData?.error) {
      return {
        data: [],
        error: true,
        errors: responseData?.errors ?? [{ message: "Não foi possível identificar o erro, contate o Administrador" }]
      };

    } else {
      return responseData;
    }

  } catch (error) {
    // se erro retorna o array de dados vazio
    console.log(error);

    return {
      data: [],
      error: true,
      errors: [{ message: error?.message ?? "Ocorreu um erro inesperado, contate o Administrador" }]
    };
  }
}

export const fetchApiDespaginado = async (route, method, body, ...props) => {
  let result = [];
  let pagina = 1;
  let maxPaginas = 10; // Só para não ir infinito (máximo 100 fetchs)

  while (pagina < maxPaginas) {
    const { data, ...fetchInfo } = await fetchApi(route, method, {
      ...body,
      ...{
        pagina: pagina,
        limite: 10
      }
    }, ...props);

    if (fetchInfo.error) {
      return fetchInfo;
    }

    for (let item of data) {
      result.push(item);
    }

    if (!fetchInfo.totalPaginas || pagina >= fetchInfo.totalPaginas) {
      break;
    }

    pagina++;
  }

  return {
    data: result,
    error: false,
    errors: []
  };
};
