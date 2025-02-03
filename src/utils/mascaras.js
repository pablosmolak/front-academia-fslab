export const formatarData = (data) => {
    if (!data) return

    const [ano, mes, resto] = data.split('-')
    const [dia,] = resto.split('T')

    return `${dia}/${mes}/${ano}`

}