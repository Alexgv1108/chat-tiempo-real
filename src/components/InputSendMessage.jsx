import { memo, useEffect, useState } from 'react';
import { saveMessage } from '@helpers';
import { userStore } from '@store/userStore';
import { DICCIONARIO_EMOJIS } from '@global/constantes';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faStop, faFaceSmileBeam } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';

let mediaRecorder = null;
let audioChunks = [];

const escapeRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Preprocesa las expresiones regulares para los emojis una vez
const emojiRegexMap = Object.keys(DICCIONARIO_EMOJIS).reduce((map, key) => {
    map[key] = new RegExp(escapeRegex(key), 'g');
    return map;
}, {});

export const InputSendMessage = memo(({ usuarioSesionUid, uidChat }) => {
    const { pathStore } = userStore();

    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [record, setRecord] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

    const handleEmojiSelect = (e) => setInputMessage((prev) => `${prev}${e.emoji}`);
    const togglePicker = () => setEmojiPickerVisible((prev) => !prev);
    const closePicker = () => setEmojiPickerVisible(false);

    const handleInputChange = (event) => {
        const valueWithEmoji = reemplazarEmojis(event.target.value);
        setInputMessage(valueWithEmoji);
    };

    const handleNewPost = async (audio = null) => {
        if (!audio && !inputMessage.trim()) return;
        saveMessage(usuarioSesionUid, uidChat, pathStore, audio, inputMessage.trim(), setInputMessage);
    };

    const reemplazarEmojis = (input) => {
        return Object.keys(emojiRegexMap).reduce(
            (mensaje, emoji) => mensaje.replace(emojiRegexMap[emoji], DICCIONARIO_EMOJIS[emoji]),
            input
        );
    };

    // Función para iniciar la grabación
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.start();
            setIsRecording(true);
        } catch {
            Swal.fire('Micrófono', 'No tienes un micrófono para grabar.', 'warning');
        }
    };

    // Función para detener la grabación
    const stopRecording = () => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setIsRecording(false);

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const base64Audio = await blobToBase64(audioBlob);
            setRecord(base64Audio);
        };
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
        if (record) handleNewPost(record);
    }, [record]);

    return (
        uidChat && (
            <form
                className="bottom-0 left-0 w-full p-4 bg-white shadow-md flex items-center relative"
                name="input-submit-message"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleNewPost();
                }}
            >
                {emojiPickerVisible && (
                    <div className="absolute bottom-16 left-6 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </div>
                )}

                {isRecording ? (
                    <p className="w-full p-2 border border-blue-600 rounded-lg mr-2 text-center">
                        Grabando audio...
                    </p>
                ) : (
                    <>
                        <button
                            type="button"
                            className="text-2xl mr-2 text-yellow-500 hover:text-yellow-600"
                            onClick={togglePicker}
                        >
                            <FontAwesomeIcon icon={faFaceSmileBeam} />
                        </button>
                        <input
                            name="text-message"
                            autoComplete="off"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                            placeholder="Escribe un mensaje"
                            aria-label="Escribe un mensaje"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onFocus={closePicker}
                        />
                    </>
                )}

                <button
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-lg"
                    type="button"
                    onClick={inputMessage.trim() ? handleNewPost : (isRecording ? stopRecording : startRecording)}
                >
                    {inputMessage.trim() ? (
                        <FontAwesomeIcon icon={faPaperPlane} className="text-xl transform rotate-45" />
                    ) : isRecording ? (
                        <FontAwesomeIcon icon={faStop} className="text-xl" />
                    ) : (
                        <FontAwesomeIcon icon={faMicrophone} className="text-xl" />
                    )}
                </button>
            </form>
        )
    );
});
