import { getAuth, onAuthStateChanged } from "firebase/auth";

export const validateSession = callback => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, callback);
    return unsubscribe;
}
