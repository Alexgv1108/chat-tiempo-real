import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseAuth } from "../firebase/config";
import { saveOrUpdateUser } from "@helpers";

export const Navbar = memo(({db, usuarioSesion}) => {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await saveOrUpdateUser(db, usuarioSesion, false);
        navigate('/');
        await FirebaseAuth.signOut();
    }

    return (
        <nav className="w-full bg-gray-800 text-white fixed top-0 left-0 z-50 h-[60px] m-0 p-0">
            <div className="flex justify-between items-center px-4 h-full w-full">
                <ul className="flex space-x-4">
                    <li>
                        <a href="#" className="text-lg font-semibold hover:text-blue-400" aria-current="page">
                            Chat en tiempo real
                        </a>
                    </li>
                </ul>
                <button
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                    onClick={handleSignOut}
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    )
})