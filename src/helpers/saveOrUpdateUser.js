import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();

export const saveOrUpdateUser = async (user, stateSession) => {
    const userRef = ref(db, 'usuarios/' + user.uid);
    return set(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        stateSession: stateSession
    });
}
