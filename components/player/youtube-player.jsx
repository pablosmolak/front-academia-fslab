
export function YouTubePlayer({ videoUrl }) {

    // Função para extrair o ID do vídeo a partir de diferentes formatos de URLs do YouTube
    const extractVideoId = (url) => {
        if (url) {
            const regex =
                /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }
    };

    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return <p>Invalid YouTube URL</p>;
    }

    return (
        <iframe
            className="top-0 left-0 w-4/5 h-4/5"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`}
            allow="encrypted-media"
            allowFullScreen
            title="YouTube Video Player"
            frameBorder="0"
            aria-label="Vídeo do YouTube"
        ></iframe>
    );

};
