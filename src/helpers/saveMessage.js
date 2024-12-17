import { getDatabase, push, ref } from 'firebase/database';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid'

const db = getDatabase();
export const saveMessage = async (usuarioSesionUid, uidChat, pathMessages, audio, InputSendMessage, setInputSendMessage) => {
    try {
        const fecha = new Date().getTime();
        const newUuid = uuid();

        const postData = {
            uid: usuarioSesionUid,
            uidTo: uidChat,
            uidUnico: newUuid,
            mensaje: audio || InputSendMessage,
            type: audio ? 'audio' : 'text',
            fecha: fecha,
        };
        const chatRef = ref(db, `chat/${pathMessages}`);
        if (!audio) setInputSendMessage('');
        await push(chatRef, postData);
    } catch (error) {
        Swal.fire('Ups', 'No se pudo enviar el mensaje, por favor inténtalo de nuevo más tarde.', 'warning');
        console.error(error);
    }
}
