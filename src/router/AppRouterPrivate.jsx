import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Chat } from "@pages/chat/Chat"
import { validateSession } from "@utils/validateSession";
import { useEffect, useState } from "react";
import { OfflineNotice } from "../components/OfflineNotice";

export const AppRouterPrivate = () => {

    const navigate = useNavigate();

    const [usuarioSesion, setUsuarioSesion] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // VALIDACIONES PREVIAS AL RENDERIZADO DEL PRIVATE

    // Listener para detectar sesión activa
    useEffect(() => {
        const unsubscribeAuth = validateSession((user) => {
            if (user) {
                if (usuarioSesion) return;
                setUsuarioSesion(user);
            } else {
                navigate('/');
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }, []);


    // RENDERIZADO DEL PRIVATE

    return !isOnline
        ? <OfflineNotice />
        : usuarioSesion && 
            <Routes>
                <Route path="/" element={<Chat usuarioSesion={usuarioSesion} />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>


}