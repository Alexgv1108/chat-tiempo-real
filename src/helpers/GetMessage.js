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

export const getMessagesByPathQuery = (db, path) => {
    return query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        limitToLast(CANTIDAD_MENSAJES)
    );
}

export const getMessagesByPathAndPaginationQuery = (db, path, datePagination) => {
    return query(
        ref(db, `chat/${path}`),
        orderByChild("fecha"),
        endBefore(datePagination),
        limitToLast(CANTIDAD_MENSAJES),
        
    );
}

export const getFullMessage = async(db, pathConst, datePagination) => {
    const getMessageQuery = datePagination
        ? getMessagesByPathAndPaginationQuery(db, pathConst || path, datePagination)
        : getMessagesByPathQuery(db, pathConst || path);

    const getMessage = await getMessages(getMessageQuery);
    return { 
        response: getMessage.val()
    };
}