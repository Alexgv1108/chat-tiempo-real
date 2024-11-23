import { push, ref } from 'firebase/database';
import React, { useRef } from 'react'
import Swal from 'sweetalert2';

let contadorEnviosVacios = 0;
export const InputSendMessage = ({ db, usuarioSesionUid, uidChat, setPosts }) => {

    const inputRef = useRef();

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
            const postData = {
                uid: usuarioSesionUid,
                mensaje: inputRef.current.value,
                fecha: fecha,
            };

            const chatRef = ref(db, `chat/${usuarioSesionUid}/${uidChat}`);
            await push(chatRef, postData);
            inputRef.current.value = '';
            const arraySet = [[usuarioSesionUid, postData]];
            setPosts(postsData => [...postsData, ...arraySet]);
        } catch (error) {
            Swal.fire('Ups', 'No se pudo enviar el mensaje, por favor inténtalo de nuevo más tarde.', 'warning');
            console.log(error);
        }
    }

    return (
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
}
