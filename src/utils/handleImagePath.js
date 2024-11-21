// Função para lidar com as imagens, se são imagens da internet públicas, ou se são imagens que estão vindo da api

export function handleImagePath(path, thumbnail = false) {
    if (path) {
      path = String(path);
  
      if (/^https?/.test(path) || /^\/images/.test(path)) {
        return path;
      } else if (thumbnail) {
        return `${process.env.NEXT_PUBLIC_API_URL}${path}?thumbnail=1`;
      } else {
        return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
      }
    }
  }