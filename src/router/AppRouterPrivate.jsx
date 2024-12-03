import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Chat } from "../pages/chat/Chat"
import { validateSession } from "../utils/validateSession";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const AppRouterPrivate = () => {

    const navigate = useNavigate();

    const [usuarioSesion, setUsuarioSesion] = useState({});

    // Listener para detectar sesión activa
    useEffect(() => {
        const unsubscribeAuth = validateSession((user) => {
            if (user) {
                if (usuarioSesion.uid) return;
                setUsuarioSesion(user);
            } else {
                Swal.fire('Ups', 'No has iniciado sesión', 'warning');
                navigate('/');
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Chat usuarioSesion={usuarioSesion} />} />
            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}