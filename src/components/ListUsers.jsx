import { getUserByUid, getAmigos } from "@helpers";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";
import { isDesktop } from 'react-device-detect';
import { diffMinutes } from '@formkit/tempo'
import { v4 as uuid } from 'uuid'

import { addFriend } from "../utils/swal/addFriend";
import { suscribeUsers } from "../helpers/suscribeUsers";
import { off } from "firebase/database";
import { constantes } from "../global/constantes";

const ahora = new Date();
const usuarios = [];
const { STATES_SESSION } = constantes();

export const ListUsers = memo(({ usuarioSesion, setLoading, uidChat, setUidChat, setShowUsers }) => {
    const [amigosState, setAmigosState] = useState([]);

    // Consulta información de los amigos en sesión
    useEffect(() => {
        (async () => {
            setLoading(true);
            const amigos = await getAmigos(usuarioSesion.uid);
            for (const [_, userInfo] of amigos) {
                let amigoMap = usuarios.find(([_, usuarioItem]) => userInfo.uid === usuarioItem.uid);

                if (!amigoMap) {
                    // Si no existe en el estado, buscar en Firebase
                    const nuevoAmigoMap = await getUserByUid(userInfo.uid);

                    const newUuid = uuid();
                    usuarios.push([newUuid, nuevoAmigoMap]);
                }
            }
            setAmigosState([...usuarios]);
            setLoading(false);
        })();
    }, []);

    // Actualiza en tiempo real el estado del usuario
    useEffect(() => {
        const newListeners = [];
        amigosState.forEach(([_, item]) => {
            const { rutaRef, listener } = suscribeUsers(item.uid, snapshotUsuario => {
                const newMessageUserKey = snapshotUsuario.key;
                if (newMessageUserKey !== 'stateSession' && newMessageUserKey !== 'lastLogin') return;

                const newMessageUserVal = snapshotUsuario.val();
                let amigoFind = amigosState.find(([_, amigoS]) => amigoS.uid === item.uid);
                amigoFind[1][newMessageUserKey] = newMessageUserVal;
                setAmigosState(amigoS => amigoS.map((amigoM) =>
                    amigoM.uid === item.uid ? amigoFind : amigoM
                ));

            });
            newListeners.push({ rutaRef, listener });
        });

        return () => {
            newListeners.forEach(({ rutaRef, listener }) => {
                off(rutaRef, "child_added", listener);
            });
        };
    }, [amigosState])


    const handleChatear = uid => {
        if (uid === uidChat) return;
        setUidChat(uid);
        setShowUsers(false);
    }

    const handleShowUser = () => {
        setShowUsers(showUsers => !showUsers);
    }

    const handleSalirChat = () => {
        setUidChat(null);
    }

    const handleAddFriend = async () => {
        addFriend(usuarios, usuarioSesion, setAmigosState);
    }

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
                    <h5 className="font-bold text-xl mb-2 mt-5">Usuarios</h5>
                    <div className="flex justify-end mb-3">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={handleAddFriend}>
                            Agregar amigo
                        </button>
                    </div>
                    <ul className="flex-grow overflow-auto">
                        {
                            amigosState.map(([uidUnico, amigoMap]) => (
                                <div
                                    className="item-hover mb-2"
                                    onClick={() => { handleChatear(amigoMap.uid) }}
                                    key={uidUnico}
                                >
                                    <li className={`flex items-center py-2 cursor-pointer p-2 ${amigoMap.uid === uidChat ? 'bg-blue-100' : ''}`}>
                                        <div>
                                            <p className="text-gray-700 text-center flex-1">{amigoMap.email}</p>
                                            <small lass="text-gray-700 text-center flex-1">{amigoMap.displayName}</small>
                                        </div>
                                        {
                                            amigoMap.stateSession === STATES_SESSION.LOGIN && diffMinutes(ahora, amigoMap.lastLogin) < 5
                                                ? <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
                                                : amigoMap.stateSession === STATES_SESSION.PENDING 
                                                    ? <div className="w-3 h-3 bg-yellow-500 rounded-full ml-auto"></div>
                                                    : <div className="w-3 h-3 bg-red-500 rounded-full ml-auto"></div>
                                        }

                                    </li>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    )
})