import { onChildAdded, ref } from "firebase/database";

export const suscribeFriends = (db, uid, callback) => {
    try {
        const amigosRef = ref(db, `amigos/${uid}`);
        return onChildChanged(amigosRef, callback);
    } catch (error) {
        console.log(error);
    }
}