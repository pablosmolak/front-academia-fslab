import { useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

export function YouTubePlayer({ videoUrl, onReady, onChangeFinalVideo }) {
    const playerRef = useRef(null);
    const checkIntervalRef = useRef(null);

    // Função para extrair o ID do vídeo a partir de diferentes formatos de URLs do YouTube
    const extractVideoId = useCallback((url) => {
        const regex =
            /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
        const match = url?.match(regex);
        return match ? match[1] : null;
    }, []);

    const videoId = extractVideoId(videoUrl);

    // Verifica se o vídeo está nos últimos 20 segundos
    const checkTimeLeft = useCallback(() => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime(); // Tempo atual do vídeo
            const duration = playerRef.current.getDuration(); // Duração total do vídeo
            const timeLeft = duration - currentTime; // Tempo restante

            if (timeLeft <= 20 && timeLeft > 0) {
                onChangeFinalVideo(true)

                clearInterval(checkIntervalRef.current); // Para de verificar após detectar
                checkIntervalRef.current = null;
            }
        }
    }, []);

    // Callback chamado quando o estado do player muda
    const onPlayerStateChange = useCallback(
        (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
                // Inicia o intervalo para verificar o tempo restante
                if (!checkIntervalRef.current) {
                    checkIntervalRef.current = setInterval(checkTimeLeft, 500); // Verifica a cada 500ms
                }
            } else {
                // Limpa o intervalo quando o vídeo é pausado ou finalizado
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
        },
        [checkTimeLeft]
    );

    const initializePlayer = useCallback(() => {
        if (window.YT && videoId && !playerRef.current) {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId,
                playerVars: {
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    autohide: 1,
                },
                events: {
                    onReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        } else if (videoId && window.YT && playerRef.current && typeof playerRef.current.cueVideoById === 'function') {
            onChangeFinalVideo(false)
            playerRef.current.cueVideoById(videoId);
        }
    }, [videoId, onReady, onPlayerStateChange]);

    useEffect(() => {
        // Verifica se a API do YouTube já está carregada
        if (window.YT) {
            initializePlayer();
        } else {
            window.onYouTubeIframeAPIReady = initializePlayer;
        }

        return () => {
            // Limpa o intervalo ao desmontar o componente
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        };
    }, [initializePlayer]);

    return (
        <>
            {videoId && (
                <>
                    <>
                        <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
                        <div
                            id="youtube-player"
                            className="w-full sm:w-1/4 md:w-1/2 lg:w-2/3 xl:w-3/4 2xl:w-2/3 h-auto aspect-video mx-4"
                            style={{ maxWidth: '1200px', maxHeight: '675px' }}
                        ></div>
                    </>


                </>
            )}
        </>
    );
}
