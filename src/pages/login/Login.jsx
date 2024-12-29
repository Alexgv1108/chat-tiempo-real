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

  const handleLoginWithGoogle = async (event) => {
    event.preventDefault();
    isLoginPending = true;

    try {
      const { isLogin } = await popUpLoginWithGoogle();
      if (isLogin) {
        navigate('/chat');
      } else {
        Swal.fire('Ups', 'No has iniciado sesión de forma correcta.', 'error');
        isLoginPending = false;
      }
    } catch (error) {
      Swal.fire('Error', 'Algo salió mal al iniciar sesión. Por favor, inténtalo de nuevo.', 'error');
      isLoginPending = false;
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-center mb-4 text-gray-700">
              Chat en Tiempo Real
            </h1>
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
              onClick={handleLoginWithGoogle}
            >
              Iniciar sesión con Google
            </button>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Autor: <span className="font-medium">Alexander Gallego Vasquez</span>
        </p>
      </div>
    </div>
  );
}