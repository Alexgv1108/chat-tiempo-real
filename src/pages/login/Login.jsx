import { FirebaseAuth } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { validateSession } from '../../utils/validateSession';
import { useEffect } from 'react';

import treesImage from '../../assets/trees.png';
import nyanCatGif from '../../assets/nyan-cat.gif';

const googleProvider = new GoogleAuthProvider();
const db = getDatabase();
let isLoginPending = false;

export const Login = () => {

  const navigate = useNavigate();

  // Listener para detectar sesión activa
  useEffect(() => {
    const unsubscribeAuth = validateSession((user) => {
      if (user && !isLoginPending) {
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
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async (event) => {
    event.preventDefault();
    isLoginPending = true;
    try {
      const result = await signInWithPopup(FirebaseAuth, googleProvider);
      if (result && result.user) {
        const userRef = ref(db, 'usuarios/' + result.user.uid);
        await set(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          lastLogin: new Date().toISOString()
        });
        navigate('/chat');
        return;
      }

      isLoginPending = false;
      Swal.fire('ups', 'No has iniciado sesión de forma correcta.');
    } catch (error) {
      isLoginPending = false;
      Swal.fire('ups', 'No has iniciado sesión de forma correcta.');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-lg rounded-lg mb-2">
          <div className="p-4">
            <h5 className="text-center text-xl font-semibold">Chat en tiempo Real</h5>
            <button
              type="submit"
              className="w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={loginWithGoogle}
            >
              Iniciar sesión con Google
            </button>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          Autor: Alexander Gallego Vasquez
        </p>
      </div>
    </div>
  )
}