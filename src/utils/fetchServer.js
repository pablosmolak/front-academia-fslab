import { cookies } from "next/headers"

// se o método for get os dados serão querys (params) se não será dados mesmo tipo body para post ou patch etc...

export const fetchServer = async (route, method, dados, isFile = false, isApiAuth = false) => {
  try {
    let urlApi = isApiAuth ? process.env.NEXT_PUBLIC_API_AUTH_URL : process.env.NEXT_PUBLIC_API_URL;

    const token = cookies().get("next-auth.requestToken").value;

    if (method === "GET" && dados) {
      let urlSearch = new URLSearchParams(dados);
      route = `${route}?${urlSearch}`;
    }

    let headersFile = {
      "Authorization": `Bearer ${token}`
    }

    let headers = {
      "Content-Type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`
    }

    const response = await fetch(`${urlApi}${route}`, {
      method: method,
      headers: isFile ? headersFile : headers,
      body: isFile ? dados : method !== "GET" && dados ? JSON.stringify(dados) : null
    })

    const responseData = await response.json();

    // se erro retorna o array de dados vazio
    if (responseData?.error) {
      return { data: [], error: true, errors: responseData?.errors ?? [{ message: "Não foi possível identificar o erro, contate o Administrador" }] };
    } else {
      return responseData;
    }

  } catch (error) {
    // se erro retorna o array de dados vazio

    return { data: [], error: true, errors: [{ message: error?.message ?? "Ocorreu um erro inesperado, contate o Administrador" }] };
  }
}
