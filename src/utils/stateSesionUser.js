import { useEffect } from "react";
import { saveOrUpdateUser } from "@helpers";
import { STATES_SESSION, TIME_TIME_OUT } from '@global/constantes';

let puedeEjecutar = true;
let timeOut = null;
let intervalo = null;

let ultimoState = STATES_SESSION.LOGIN;

export const stateSesionUser = (usuarioSesion) => {

    // Evento para que el usuario aparezca en linea
    useEffect(() => {
        const handleMouseMove = () => validacionMinutos(usuarioSesion);

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (timeOut) clearTimeout(timeOut);
        }
    }, []);

    // Evento para que el usuario aparezca en estado inactivo pero no desconectado
    useEffect(() => {
        intervalo = intervalSessionPending(usuarioSesion);
        return () => {
            if (intervalo) clearInterval(intervalo);
        }
    }, [])
}

// evento para validación de sesión, cada x minutos se habilita para evitar asignar en mucha cantidad el new Date
const validacionMinutos = async (usuarioSesion) => {
    if (!puedeEjecutar) return;
    puedeEjecutar = false;
    timeOut = setTimeout(async () => {
        ultimoState = STATES_SESSION.LOGIN;
        puedeEjecutar = true;
        if (intervalo) {
            clearInterval(intervalo);
            intervalo = intervalSessionPending(usuarioSesion);
        }
    }, TIME_TIME_OUT);
    await saveOrUpdateUser(usuarioSesion, STATES_SESSION.LOGIN);
}

const intervalSessionPending = (usuarioSesion) => {
    return setInterval(async () => {
        if (ultimoState !== STATES_SESSION.LOGIN) return;
        await saveOrUpdateUser(usuarioSesion, STATES_SESSION.PENDING);
        ultimoState = STATES_SESSION.PENDING;
    }, TIME_TIME_OUT * 2);
}