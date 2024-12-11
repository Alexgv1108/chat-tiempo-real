import { getDatabase, onChildChanged, ref } from "firebase/database";

const db = getDatabase();

export const suscribeUsers = (uid, callback) => {
    try {
        const usuariosRef = ref(db, `usuarios/${uid}`);
        return {
            listener: onChildChanged(usuariosRef, callback),
            rutaRef: usuariosRef
        };
    } catch (error) {
        console.log(error);
    }
}
