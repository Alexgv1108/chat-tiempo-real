import { push, ref } from 'firebase/database';
import React, { memo, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import Swal from 'sweetalert2';
import { constantes } from '../global/constantes';

const { DICCIONARIO_EMOJIS } = constantes();

let contadorEnviosVacios = 0;
export const InputSendMessage = memo(({ db, usuarioSesionUid, uidChat, pathMessages }) => {

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

    const reemplazoEmojiDinamico = () => {
        // Reemplazo dinámico
        for (let clave in DICCIONARIO_EMOJIS) {
            let regex = new RegExp(escapeRegex(clave), "g");
            inputRef.current.value = inputRef.current.value.replace(regex, DICCIONARIO_EMOJIS[clave]);
        }
    }

    return (
        uidChat && (
            <form className="bottom-0 left-0 w-full p-4 bg-white shadow-md flex items-center" onSubmit={handleNewPost} name='input-submit-message'>
                <input
                    name='text-message'
                    autoComplete='off'
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                    placeholder="Escribe un mensaje"
                    aria-label="Escribe un mensaje"
                    ref={inputRef}
                    onChange={reemplazoEmojiDinamico}
                />
                <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    type="submit"
                >
                    Enviar
                </button>
            </form>
        )
    )
})
