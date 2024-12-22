import { memo, useEffect, useState } from 'react'
import { saveMessage } from '@helpers';
import { userStore } from '@store/userStore';
import { DICCIONARIO_EMOJIS } from '@global/constantes';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { faFaceSmileBeam } from '@fortawesome/free-solid-svg-icons/faFaceSmileBeam';

let mediaRecorder = false;
let audioChunks = [];

function escapeRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Preprocesamos las expresiones regulares para los emojis una vez
const emojiRegexMap = Object.keys(DICCIONARIO_EMOJIS).reduce((map, key) => {
    const regex = new RegExp(escapeRegex(key), 'g');
    map[key] = regex;
    return map;
}, {});

export const InputSendMessage = memo(({ usuarioSesionUid, uidChat }) => {

    const { pathStore } = userStore();

    const [InputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [record, setRecord] = useState(false);

    const [emoji, setEmoji] = useState("");

    const handleEmojiSelect = (e) => {
        setInputMessage(`${InputMessage}${e.emoji}`)
    };

    const togglePicker = () => {
        setEmoji(!emoji);
    }

    const closePicker = () => {
        setEmoji(false);
    }

    const handleInputChange = (event) => {
        const valueWithEmoji = reemplazoEmojiDinamico(event.target.value);
        setInputMessage(valueWithEmoji);
    };

    const handleNewPost = async (audio) => {
        if (!audio && !InputMessage) return;
        saveMessage(usuarioSesionUid, uidChat, pathStore, audio, InputMessage, setInputMessage);
    }

    const handleOnSubmitForm = async (event) => {
        event.preventDefault();
        handleNewPost();
    }

    const reemplazoEmojiDinamico = (input) => {
        let messageWithEmoji = input;
        for (let clave in emojiRegexMap) {
            messageWithEmoji = messageWithEmoji.replace(emojiRegexMap[clave], DICCIONARIO_EMOJIS[clave]);
        }
        return messageWithEmoji;
    };

    // Función para iniciar la grabación
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            Swal.fire('Micrófono', 'No tienes un micrófono para grabar.', 'warning')
        }
    };

    // Función para detener la grabación
    const stopRecording = () => {
        try {
            mediaRecorder.stop();
            setIsRecording(false);

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const base64Audio = await blobToBase64(audioBlob);
                setRecord(base64Audio);
            };
        } catch (error) {
            console.error('Error al convertir el Blob a Base64:', error);
            Swal.fire('No se pudo enviar el audio', 'Por favor, intente de nuevo más tarde', 'warning');
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
        handleNewPost(record);
    }, [record])


    return (
        uidChat && (
            <>
                <form className="bottom-0 left-0 w-full p-4 bg-white shadow-md flex items-center" name='input-submit-message' onSubmit={handleOnSubmitForm}>
                    {
                        <div className="absolute bottom-0 lef-0 p-2 z-10 mb-16 ml-6">
                            <EmojiPicker
                                open={emoji}
                                onEmojiClick={handleEmojiSelect}
                            />
                        </div>
                    }

                    <button
                        type="button"
                        className="text-2xl mr-2 text-yellow-500 hover:text-yellow-600"
                        onClick={togglePicker}
                    >
                        <FontAwesomeIcon icon={faFaceSmileBeam} />
                    </button>

                    <input
                        name='text-message'
                        autoComplete='off'
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                        placeholder="Escribe un mensaje"
                        aria-label="Escribe un mensaje"
                        value={InputMessage}
                        onChange={handleInputChange}
                        onFocus={closePicker}
                        disabled={isRecording}
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
