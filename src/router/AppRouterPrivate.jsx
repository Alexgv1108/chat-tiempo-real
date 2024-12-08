import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Loader } from "@components";
import { Chat } from "@pages/chat/Chat"
import { validateSession } from "@utils/validateSession";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const AppRouterPrivate = () => {

    const navigate = useNavigate();

    const [usuarioSesion, setUsuarioSesion] = useState(null);

    // VALIDACIONES PREVIAS AL RENDERIZADO DEL PRIVATE

    // Listener para detectar sesión activa
    useEffect(() => {
        const unsubscribeAuth = validateSession((user) => {
            if (user) {
                if (usuarioSesion) return;
                setUsuarioSesion(user);
            } else {
                Swal.fire('Ups', 'No has iniciado sesión', 'warning');
                navigate('/');
            }
        });

        return () => unsubscribeAuth();
    }, []);


    // RENDERIZADO DEL PRIVATE

    return !usuarioSesion
        ? (<Loader />)
        : (
            <Routes>
                <Route path="/" element={<Chat usuarioSesion={usuarioSesion} />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        )


}