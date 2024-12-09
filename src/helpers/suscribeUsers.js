import { onChildChanged, ref } from "firebase/database";

export const suscribeUsers = (db, uid, callback) => {
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
