export const formatarData = (data) => {
    if (!data) return

    const [ano, mes, resto] = data.split('-')
    const [dia,] = resto.split('T')

    return `${dia}/${mes}/${ano}`

}

export const dataPorExtenso = (data) => {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const dataObj = new Date(data);
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}

export const transformarEmFormatoCompacto = (hora) => {

    const regex = /^(\d{2}):(\d{2}):(\d{2})$/;

    const match = hora.match(regex);

    if (match) {
        const horas = parseInt(match[1], 10);
        const minutos = parseInt(match[2], 10);

        return `${horas}h${minutos}m`;
    }
}
