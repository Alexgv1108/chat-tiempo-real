import { format } from "@formkit/tempo"
import { faPaperPlane, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export const Message = ({ postContent, usuarioSesionUid, posts, index, isAnimacionMensaje }) => {

    const [waveform, setWaveform] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const waveformRef = useRef(null);

    // Iniciar Wavesurfer.js cuando se monta el componente
    useEffect(() => {
        if (postContent.type === 'audio' && waveformRef.current) {
            const wave = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'navy',
                progressColor: 'blue',
                cursorColor: 'purple',
                barWidth: 3,
                height: 50,
                normalize: true,
                responsive: true,
            });

            // Crear el Blob y cargar el audio en Wavesurfer
            const audioBlob = base64ToBlob(postContent.mensaje, 'audio/mp3');
            wave.load(URL.createObjectURL(audioBlob));
            setWaveform(wave);

            // Actualizar el estado de "isPlaying" cuando el audio cambie de estado
            wave.on('play', () => setIsPlaying(true));
            wave.on('pause', () => setIsPlaying(false));

            return () => wave.destroy();
        }
    }, []);

    // Función para manejar Play/Pause
    const togglePlayPause = () => {
        if (waveform) {
            if (isPlaying) {
                waveform.pause();
            } else {
                waveform.play();
            }
        }
    };

    // Función para convertir Base64 a Blob
    const base64ToBlob = (base64, mimeType) => {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, { type: mimeType });
    };


    return (
        <div
            className={`shadow-sm mb-3 rounded-lg p-4
                ${postContent.uid === usuarioSesionUid
                    ? 'bg-gray-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-800 mr-auto'
                }
                ${index === (posts.length - 1) && isAnimacionMensaje ? 'animate-growFromBottom' : ''}
              `}
            style={{
                maxWidth: "85%",
            }}
        >
            <div className="flex justify-between items-center">
                {
                    postContent.type === 'audio'
                        ? <div className="mt-4 w-full flex items-center">
                            {/* Aquí se mostrará la onda */}
                            <div ref={waveformRef} className="w-[90%]"></div>

                            {/* Contenedor para los controles de audio y el ícono de enviar */}
                            <div className="flex items-center ml-4">
                                {/* Botón de Play/Pause */}
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
                        : <p className="text-sm flex-grow">{postContent.mensaje}</p>
                }

                <small className={`${postContent.uid === usuarioSesionUid
                    ? 'text-white'
                    : 'text-gray-500'
                    }`}>{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
            </div>
        </div>
    )
}