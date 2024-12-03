import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useMemo } from "react";
import { get, ref } from "firebase/database";
import { isDesktop } from 'react-device-detect';

import defaultImage from '../assets/image_user.png';

export const ListUsers = memo(({ db, usuarioSesion, usuarios, setUsuarios, loading, setLoading, uidChat, setUidChat, setShowUsers }) => {

    // Consulta inicial de lista de usuarios registrados
    useEffect(() => {
        if (!usuarioSesion.uid) return;
        setLoading(true);
        (async () => {
            const userRef = ref(db, 'usuarios');
            try {
                const consulta = await get(userRef);
                const dataConsulta = consulta.val() || {};

                const dataFilter = Object.entries(dataConsulta).filter(([key]) => key !== usuarioSesion.uid);
                setUsuarios(dataFilter);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                Swal.fire('Ups', 'No se pudieron recuperar la lista de usuarios, por favor intenta de nuevo más tarde', 'warning');
                console.error("Error fetching data:", error);
            }
        })();
    }, [usuarioSesion]);

    const handleChatear = uid => {
        if (loading || uid === uidChat) return;
        setUidChat(uid);
        setShowUsers(false);
    }

    const handleShowUser = () => {
        setShowUsers(showUsers => !showUsers);
    }

    const handleSalirChat = () => {
        setUidChat(null);
    }

    const getUserList = useMemo(() => {
        if (!usuarios.length) return;
        return usuarios.map(([userId, userInfo]) => (
            <div
                className="item-hover mb-2"
                onClick={() => { handleChatear(userId) }}
                key={userId}
            >
                <li className={`flex items-center py-2 cursor-pointer p-2 ${userId === uidChat ? 'bg-blue-100' : ''}`}>
                    <img
                        className="w-10 h-10 mr-4"
                        src={userInfo.photoURL || defaultImage}
                        loading="lazy"
                        alt={`Imagen de perfil del usuario ${userInfo.email}`}
                    />
                    <div>
                        <p className="text-gray-700 text-center flex-1">{userInfo.email}</p>
                        <small lass="text-gray-700 text-center flex-1">{userInfo.displayName}</small>
                    </div>
                </li>
            </div>
        ));
    }, [usuarios, uidChat]);

    return (
        <>
            {
                !isDesktop && !uidChat && (<div className="fixed top-20 right-6 z-[9999]" onClick={handleShowUser}>
                    <button className="p-3 bg-gray-800 text-white rounded-full shadow-lg">
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </div>)
            }
            {
                !isDesktop && uidChat && (<div className="fixed top-20 right-6 z-[9999]" onClick={handleSalirChat}>
                    <button className="p-3 bg-gray-800 text-white rounded-full shadow-lg">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>)
            }
            <div className="rounded overflow-hidden shadow-lg bg-white h-screen overflow-y-auto">
                <div className="ml-2 mr-2 mt-16">
                    <h5 className="font-bold text-xl mb-2 mt-4">Usuarios</h5>
                    <ul className="flex-grow overflow-auto">
                        {getUserList}
                    </ul>
                </div>
            </div>
        </>
    )
})