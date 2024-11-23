import { endBefore, get, limitToLast, orderByChild, query, ref } from "firebase/database";
import Swal from "sweetalert2";

const CANTIDAD_MENSAJES = 8;
const getMessages = postsRef => {
    try {
        return get(postsRef);
    } catch (error) {
        Swal.fire('Ups', 'Error al cargar los mensajes, por favor intenta más tarde.', 'warning');
        console.error("Error fetching data:", error);
    }
}

export const getMessagesByPath = async (db, path) => {
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

export const getFullMessageByPath = async(db, path, path2, datePagination) => {
    const getMessageFrom = datePagination
        ? getMessagesByPathAndPagination(db, path, datePagination)
        : getMessagesByPath(db, path)
    const getMessageTo = datePagination
        ? getMessagesByPathAndPagination(db, path2, datePagination)
        : getMessagesByPath(db, path2)
    const [messageFrom, messageTo] = await Promise.all([getMessageFrom, getMessageTo]);
    return { ...messageFrom.val(), ...messageTo.val() };
}