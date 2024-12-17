import { endBefore, get, getDatabase, limitToLast, orderByChild, query, ref, startAt } from "firebase/database";
import Swal from "sweetalert2";
import { CANTIDAD_MENSAJES } from '@global/constantes';

const db = getDatabase();

export const getMessages = postsRef => {
    try {
        return get(postsRef);
    } catch (error) {
        Swal.fire('Ups', 'Error al cargar los mensajes, por favor intenta más tarde.', 'warning');
        console.error("Error fetching data:", error);
    }
}

export const getMessagesByPathQuery = (path) => {
    return query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        limitToLast(CANTIDAD_MENSAJES)
    );
}

export const getMessagesAtTimeNow = (path) => {
    return query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        startAt(Date.now())
    );
}

export const getMessagesByPathAndPaginationQuery = (path, datePagination) => {
    return query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        endBefore(datePagination),
        limitToLast(CANTIDAD_MENSAJES),
        
    );
}

export const getFullMessage = async(pathConst, datePagination) => {
    const getMessageQuery = datePagination
        ? getMessagesByPathAndPaginationQuery(pathConst || path, datePagination)
        : getMessagesByPathQuery(pathConst || path);

    const getMessage = await getMessages(getMessageQuery);
    return { 
        response: getMessage.val()
    };
}