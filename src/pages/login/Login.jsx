import { getDatabase } from 'firebase/database';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { validateSession } from '@utils/validateSession';
import { useEffect } from 'react';
import { activeSession } from '../../utils/swal/activeSession';
import { popUpLoginWithGoogle } from '@helpers';

let isLoginPending = false;

export const Login = () => {

  const navigate = useNavigate();

  // Listener para detectar sesión activa
  useEffect(() => {
    const unsubscribeAuth = validateSession((user) => {
      if (user && !isLoginPending) {
        activeSession(user, navigate);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async (event) => {
    event.preventDefault();
    isLoginPending = true;
    const { isLogin } = await popUpLoginWithGoogle();
    if (isLogin) navigate('/chat');
    else {
      Swal.fire('ups', 'No has iniciado sesión de forma correcta.');
      isLoginPending = false;
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