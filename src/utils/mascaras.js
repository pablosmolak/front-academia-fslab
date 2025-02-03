export const formatarData = (data) => {
    const [ano, mes, resto] = data.split('-')
    const [dia,] = resto.split('T')
  
    return `${dia}/${mes}/${ano}`
  
  }