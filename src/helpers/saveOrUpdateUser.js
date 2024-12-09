import { ref, set } from "firebase/database";

export const saveOrUpdateUser = async (db, user, isSesion) => {
    const userRef = ref(db, 'usuarios/' + user.uid);
    return set(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        isSesion: isSesion
    });
}
