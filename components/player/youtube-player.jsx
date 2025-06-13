import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

export function YouTubePlayer({ videoUrl, onReady, onChangeFinalVideo }) {
    const playerRef = useRef(null);
    const checarIntervaloRef = useRef(null);

    const extractVideoId = useCallback((url) => {
        const regex =
            /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
        const match = url?.match(regex);
        return match ? match[1] : null;
    }, []);

    const videoId = extractVideoId(videoUrl);

    const chegarTempoRestante = useCallback(() => {
        if (playerRef.current) {
            const tempoAtual = playerRef.current.getCurrentTime(); 
            const duracaoVideo = playerRef.current.getDuration();
            const tempoRestante = duracaoVideo - tempoAtual;

            if (tempoRestante <= 20 && tempoRestante > 0) {
                onChangeFinalVideo(true);

                clearInterval(checarIntervaloRef.current);
                checarIntervaloRef.current = null;
            }
        }
    }, []);

    const onPlayerStateChange = useCallback(
        (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
                if (!checarIntervaloRef.current) {
                    checarIntervaloRef.current = setInterval(chegarTempoRestante, 500);
                }
            } else {
                clearInterval(checarIntervaloRef.current);
                checarIntervaloRef.current = null;
            }
        },
        [chegarTempoRestante]
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
            clearInterval(checarIntervaloRef.current);
            checarIntervaloRef.current = null;
        };
    }, [initializePlayer]);

    return (
        <>
            {videoId && (
                <>
                    <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
                    <div
                        className="w-full h-full aspect-video rounded overflow-hidden relative"
                        id="youtube-player"
                    />
                </>
            )}
        </>
    );
}