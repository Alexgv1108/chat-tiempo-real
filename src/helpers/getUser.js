import { equalTo, get, getDatabase, orderByChild, query, ref } from "firebase/database";

const db = getDatabase();

export const getUserByUid = async (uid) => {
    try {
        const usuarioRef = ref(db, `usuarios/${uid}`);
        const response = await get(usuarioRef);
        return response.val();
    } catch (error) {
        console.log(error);
    }
}

export const getAmigos = async (uid) => {
    try {
        const amigosRef = ref(db, `amigos/${uid}`);
        const response = await get(amigosRef);
        const amigos = response.val();
        return amigos ? Object.entries(amigos) : [];
    } catch (error) {
        console.log(error);
    }
}

export const getUserByEmail = async (email) => {
    const usuariosRef = ref(db, 'usuarios');
    const consulta = query(usuariosRef, orderByChild('email'), equalTo(email));

    try {
        const snapshot = await get(consulta);
        const datos = snapshot.val();
        return datos ? Object.entries(datos) : null;
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
    }
}