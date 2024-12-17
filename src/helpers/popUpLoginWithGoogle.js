import { saveOrUpdateUser } from "@helpers";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseAuth } from "../firebase/config";
import { STATES_SESSION } from '@global/constantes';

const googleProvider = new GoogleAuthProvider();

export const popUpLoginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        await saveOrUpdateUser(result.user, STATES_SESSION.LOGIN);
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
