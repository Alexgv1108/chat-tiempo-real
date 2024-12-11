import { getDatabase, push, ref } from "firebase/database";
import Swal from "sweetalert2";
import { getUserByEmail } from "@helpers";

// TODO: mover a helper
const db = getDatabase();

export const addFriend = (usuarios, usuarioSesion, setAmigosState) => {
    Swal.fire({
        title: "Agregar un amigo.",
        input: "text",
        inputAttributes: {
            autocomplete: "off",
        },
        html: `
            <p>Escribe el amigo que deseas agregar<p/>
        `,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Agregar amigo",
        showLoaderOnConfirm: true,
        cancelButtonText: "Cerrar",
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
            rgba(0,0,123,0.4)
            left top
            no-repeat
        `,
        preConfirm: async (emailBusqueda) => {
            try {
                if (usuarioSesion.email === emailBusqueda) {
                    Swal.showValidationMessage(`El correo ingresado es el del usuario en sesión...`);
                    return;
                }
                let userFind = usuarios.find(usuarioBusqueda => usuarioBusqueda[1].email === emailBusqueda);
                if (!userFind) {
                    userFind = await getUserByEmail(emailBusqueda);
                    if (!userFind) return Swal.showValidationMessage(`El usuario no se encuentra registrado...`);
                    userFind = [...userFind][0];
                }
                await saveAmigo(userFind[1], usuarioSesion);
                setAmigosState(amigosState => [...amigosState, userFind]);
                return userFind;
            } catch (error) {
                Swal.showValidationMessage(`Error al intentar agregar el mensaje, por favor intenta de nuevo más tarde...`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Amigo agregado!',
                text: `Has agregado a ${result.value[1].displayName}`
            });
        }
    })
}

const saveAmigo = async (newFriend, usuarioSesion) => {
    const postData = {
        uid: newFriend.uid,
        fecha: new Date().getTime(),
    };

    const amigoRef = ref(db, `amigos/${usuarioSesion.uid}`);
    return push(amigoRef, postData);
}