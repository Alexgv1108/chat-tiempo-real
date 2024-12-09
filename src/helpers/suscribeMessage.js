import { onChildAdded } from "firebase/database";

export const suscribeMessage = (postsRef, callback) => {
    return onChildAdded(postsRef, callback);
}
