import { memo, useEffect, useState } from 'react'
import { saveMessage } from '@helpers';
import { userStore } from '@store/userStore';
import { DICCIONARIO_EMOJIS } from '@global/constantes';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons';
import { ReactMic } from 'react-mic';

export const InputSendMessage = memo(({ usuarioSesionUid, uidChat }) => {

    const { pathStore } = userStore();

    const [InputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [record, setRecord] = useState(false);


    function escapeRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const handleInputChange = (event) => {
        const valueWithEmoji = reemplazoEmojiDinamico(event.target.value);
        setInputMessage(valueWithEmoji);
    };

    const handleNewPost = async (event, audio) => {
        // TODO: VALIDAR PQ SE RECARGA
        if (event) event.preventDefault();
        if (!audio && !InputMessage) return;
        saveMessage(usuarioSesionUid, uidChat, pathStore, audio, InputMessage, setInputMessage);
    }

    const reemplazoEmojiDinamico = (input) => {
        // Reemplazo dinámico
        let messageWithEmoji = input;
        for (let clave in DICCIONARIO_EMOJIS) {
            let regex = new RegExp(escapeRegex(clave), "g");
            messageWithEmoji = messageWithEmoji.replace(regex, DICCIONARIO_EMOJIS[clave]);
        }
        return messageWithEmoji;
    }

    // Función para iniciar la grabación
    const startRecording = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
        } catch (error) {
            Swal.fire('Micrófono', 'No tienes un micrófono para grabar...', 'warning')
        }
    };

    // Función para detener la grabación
    const stopRecording = () => {
        setIsRecording(false);
    };

    // Guardar el archivo de audio una vez terminado
    const onStop = async (recordedBlob) => {
        try {
            // Convertir el Blob a Base64
            const response = await fetch(recordedBlob.blobURL);
            const blob = await response.blob();
            const base64Audio = await blobToBase64(blob);
            setRecord(base64Audio);
        } catch (error) {
            Swal.fire('No se pudo enviar el audio', 'Por favor, intente de nuevo más tarde', 'warning')
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    useEffect(() => {
        if (!record) return;
        handleNewPost(null, record);
    }, [record])


    return (
        uidChat && (
            <>
                {
                    <ReactMic
                        record={isRecording}
                        onStop={onStop}
                        mimeType="audio/mp3"
                        className="hidden"
                    />
                }
                <form className="bottom-0 left-0 w-full p-4 bg-white shadow-md flex items-center" name='input-submit-message'>
                    <input
                        name='text-message'
                        autoComplete='off'
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                        placeholder="Escribe un mensaje"
                        aria-label="Escribe un mensaje"
                        value={InputMessage}
                        onChange={handleInputChange}
                    />
                    <button
                        className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-lg"
                        type="button"
                        onClick={InputMessage ? handleNewPost : (isRecording ? stopRecording : startRecording)}
                    >
                        {InputMessage
                            ? <FontAwesomeIcon icon={faPaperPlane} className="text-xl transform rotate-45" />
                            : (isRecording
                                ? <FontAwesomeIcon icon={faStop} className="text-xl" />
                                : <FontAwesomeIcon icon={faMicrophone} className="text-xl" />
                            )
                        }
                    </button>
                </form>
            </>
        )
    )
})
