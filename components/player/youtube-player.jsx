import { useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

export function YouTubePlayer({ videoUrl, onReady }) {
    const playerRef = useRef(null);

    // Função para extrair o ID do vídeo a partir de diferentes formatos de URLs do YouTube
    const extractVideoId = useCallback((url) => {
        const regex =
            /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
        const match = url?.match(regex);
        return match ? match[1] : null;
    }, []);

    const videoId = extractVideoId(videoUrl);

    const initializePlayer = useCallback(() => {
        if (window.YT && videoId && !playerRef.current) {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId,
                playerVars: {
                    'controls': 1, // Remove os controles
                    'modestbranding': 1, // Remove o logo do YouTube
                    'rel': 0, // Remove sugestões de vídeos ao final
                    'showinfo': 0, // Remove o título do vídeo
                    'autohide': 1 // Oculta os controles automaticamente
                  },
                events: {
                    onReady,
                },
            });
        } else if (videoId && window.YT && playerRef.current && typeof playerRef.current.cueVideoById === 'function') {
            // Se o player já existe, apenas troca o vídeo
            playerRef.current.cueVideoById(videoId);
        }
    }, [videoId, onReady]);

    useEffect(() => {
        // Verifica se a API do YouTube já está carregada
        if (window.YT) {
            initializePlayer();
        } else {
            window.onYouTubeIframeAPIReady = initializePlayer;
        }
    }, [initializePlayer]);

    return (
        <>
            {videoId && (
                <>
                    <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
                    <div id="youtube-player" style={{ width: '80%', height: '80%' }}></div>
                </>
            )}
        </>
    );
}
