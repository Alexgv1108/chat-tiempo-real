import Swal from "sweetalert2";

import treesImage from '@assets/trees.png';
import nyanCatGif from '@assets/nyan-cat.gif';
import { FirebaseAuth } from "../../firebase/config";


export const activeSession = (user, navigate) => {
    Swal.fire({
        title: "Sesión activa.",
        html: `Tienes una sesión activa con el correo <b>${user.email}</b>, ¿deseas continuar con la sesión?`,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No, cerrar sesión",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: `#fff url(${treesImage})`,
        backdrop: `
            rgba(0,0,123,0.4)
            url(${nyanCatGif})
            left top
            no-repeat
          `
      }).then((result) => {
        if (result.isConfirmed) navigate('/chat');
        else if (result.dismiss === Swal.DismissReason.cancel) {
          (async () => {
            await FirebaseAuth.signOut();
          })();
        }
      })
}
