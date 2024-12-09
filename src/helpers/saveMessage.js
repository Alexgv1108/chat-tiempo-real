import { push, ref } from 'firebase/database';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid'

export const saveMessage = async (db, usuarioSesionUid, uidChat, pathMessages, inputRef) => {
    try {
        const fecha = new Date().getTime();
        const newUuid = uuid();

        const postData = {
            uid: usuarioSesionUid,
            uidTo: uidChat,
            uidUnico: newUuid,
            mensaje: inputRef.current.value,
            fecha: fecha,
        };
        const chatRef = ref(db, `chat/${pathMessages}`);
        inputRef.current.value = '';
        await push(chatRef, postData);
    } catch (error) {
        Swal.fire('Ups', 'No se pudo enviar el mensaje, por favor inténtalo de nuevo más tarde.', 'warning');
        console.log(error);
    }
}
