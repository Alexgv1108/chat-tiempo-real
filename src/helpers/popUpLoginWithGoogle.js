import { saveOrUpdateUser } from "@helpers";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseAuth } from "../firebase/config";

const googleProvider = new GoogleAuthProvider();

export const popUpLoginWithGoogle = async (db) => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        await saveOrUpdateUser(db, result.user, true);
        return {
            isLogin: true,
            data: result
        };
    } catch (error) {
        console.error(error);
        return {
            isLogin: false,
            data: error
        };
    }
}
