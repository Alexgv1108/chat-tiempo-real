import { getDatabase, ref } from "firebase/database";

const db = getDatabase();

export const suscribeFriends = (uid, callback) => {
    try {
        const amigosRef = ref(db, `amigos/${uid}`);
        return onChildChanged(amigosRef, callback);
    } catch (error) {
        console.log(error);
    }
}