import { endBefore, get, limitToLast, orderByChild, query, ref } from "firebase/database";
import Swal from "sweetalert2";
import { constantes } from "../global/constantes";

const { CANTIDAD_MENSAJES } = constantes();

const getMessages = postsRef => {
    try {
        return get(postsRef);
    } catch (error) {
        Swal.fire('Ups', 'Error al cargar los mensajes, por favor intenta más tarde.', 'warning');
        console.error("Error fetching data:", error);
    }
}

export const getMessagesByPath = async (db, path) => {
    debugger;
    const postsRef = query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        limitToLast(CANTIDAD_MENSAJES)
    );
    
    return getMessages(postsRef);
}

export const getMessagesByPathAndPagination = async (db, path, datePagination) => {
    const postsRef = query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        endBefore(datePagination),
        limitToLast(CANTIDAD_MENSAJES),
        
    );
    
    return getMessages(postsRef);
}

export const getFullMessage = async(db, pathConst, datePagination) => {
    const getMessageFrom = datePagination
        ? await getMessagesByPathAndPagination(db, pathConst || path, datePagination)
        : await getMessagesByPath(db, pathConst || path);

    return { 
        response: getMessageFrom.val()
    };
}
