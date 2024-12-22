import { useEffect, useRef, useState } from 'react';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createWaveSurfer } from '@utils/wavesurfer/createWaveSurfer';

export const AudioMessage = ({ postContent }) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [waveform, setWaveform] = useState(null);
    const waveformRef = useRef(null);

    useEffect(() => {
        let isLoad = false;
        let wave = createWaveSurfer(postContent.mensaje, waveformRef);

        wave.on('ready', () => {
            isLoad = true;
            setIsPlaying(false);
        });

        wave.on('play', () => setIsPlaying(true))
        wave.on('pause', () => setIsPlaying(false));

        wave.on('error', () => {
            finalizarCargaWave(wave);
        });

        wave.on('seek', () => {
            console.log('Barra de progreso actualizada');
        });

        setWaveform(wave);

        return () => {
            finalizarCargaWave(wave);
        };
    }, []);

    const finalizarCargaWave = (wave) => {
        if (wave) {
            wave.destroy();
            wave = null;
        }
    }

    // Función para manejar Play/Pause
    const togglePlayPause = () => {
        if (!waveform) return;
        if (isPlaying) waveform.pause();
        else waveform.play();
    };

    return (
        <div className="mt-4 w-full flex items-center">
            <div
                ref={waveformRef}
                className="w-[94%] h-full"
            ></div>
            <div className="flex items-center ml-4">
                <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-lg"
                >
                    {isPlaying
                        ? <FontAwesomeIcon icon={faStop} />
                        : <FontAwesomeIcon icon={faPlay} />
                    }
                </button>
            </div>
        </div>
    )
}
