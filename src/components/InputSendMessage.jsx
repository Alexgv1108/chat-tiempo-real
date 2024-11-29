import { push, ref } from 'firebase/database';
import React, { useRef } from 'react'
import Swal from 'sweetalert2';
import { constantes } from '../global/constantes';

const { DICCIONARIO_EMOJIS } = constantes();

let contadorEnviosVacios = 0;
export const InputSendMessage = ({ db, usuarioSesionUid, uidChat, pathMessages }) => {

    const inputRef = useRef();

    function escapeRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const handleNewPost = async event => {
        event.preventDefault();
        if (!inputRef.current.value) {
            if (++contadorEnviosVacios > 9) {
                Swal.fire('Enviar un mensaje', 'Debes de ingresar texto en el campo de mensajes para que se pueda enviar.', 'info')
            }
            return
        };
        contadorEnviosVacios = 0;
        try {
            const fecha = new Date().getTime();

            // Reemplazo dinámico
            debugger;
            let messageReplaceEmojis = inputRef.current.value
            for (let clave in DICCIONARIO_EMOJIS) {
                let regex = new RegExp(escapeRegex(clave), "g");
                messageReplaceEmojis = messageReplaceEmojis.replace(regex, DICCIONARIO_EMOJIS[clave]);
            }

            const postData = {
                uid: usuarioSesionUid,
                uidTo: uidChat,
                mensaje: messageReplaceEmojis,
                fecha: fecha,
            };

            debugger;
            const chatRef = ref(db, `chat/${pathMessages}`);
            await push(chatRef, postData);
            inputRef.current.value = '';
        } catch (error) {
            Swal.fire('Ups', 'No se pudo enviar el mensaje, por favor inténtalo de nuevo más tarde.', 'warning');
            console.log(error);
        }
    }

    return (
        uidChat && (
            <form className="input-group p-2 border-top bg-light" onSubmit={handleNewPost}>
                <input
                    type="text"
                    className="form-control p-2"
                    placeholder="Escribe un mensaje..."
                    aria-label="Escribe un mensaje"
                    ref={inputRef}
                />
                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    Enviar
                </button>
            </form>
        )
    )
}
