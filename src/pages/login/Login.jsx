import { FirebaseAuth } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const googleProvider = new GoogleAuthProvider();
const db = getDatabase();

export const Login = () => {
  
  const navigate = useNavigate();

  const loginWithGoogle = async (event) => {
    event.preventDefault();
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

      Swal.fire('ups', 'No has iniciado sesión de forma correcta.');
    } catch (error) {
      Swal.fire('ups', 'No has iniciado sesión de forma correcta.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ width: '100%', maxWidth: '350px' }}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center">Chat en tiempo Real</h5>
          <button type="submit" className="btn btn-primary w-100 mt-2 d-flex justify-content-center align-items-center" onClick={loginWithGoogle}>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
          <p className='text-center fs-6 text-secondary text-opacity-50 mt-2'>Autor: Alexander Gallego Vasquez</p>
      </div>
    </div>
  )
}