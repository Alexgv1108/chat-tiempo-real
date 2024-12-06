import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useMemo, useState } from "react";
import { equalTo, get, orderByChild, push, query, ref } from "firebase/database";
import { isDesktop } from 'react-device-detect';
import { diffMinutes } from '@formkit/tempo'
import { v4 as uuid } from 'uuid'

import Swal from "sweetalert2";
import { getUserByUid, getAmigos, getUserByEmail } from "../helpers/getUser";

const ahora = new Date();
const usuarios = [];

export const ListUsers = memo(({ db, usuarioSesionUid, setLoading, uidChat, setUidChat, setShowUsers }) => {
    const [amigosState, setAmigosState] = useState([]);

    // Consulta información de los amigos en sesión
    useEffect(() => {
        if (!usuarioSesionUid) return;

        (async () => {
            setLoading(true);
            const amigos = await getAmigos(db, usuarioSesionUid);
            for (const [_, userInfo] of amigos) {
                let amigoMap = usuarios.find(([_, usuarioItem]) => userInfo.uid === usuarioItem.uid);

                if (!amigoMap) {
                    // Si no existe en el estado, buscar en Firebase
                    const nuevoAmigoMap = await getUserByUid(db, userInfo.uid);

                    const newUuid = uuid();
                    usuarios.push([newUuid, nuevoAmigoMap]);
                }
            }
            setAmigosState([...usuarios]);
            setLoading(false);
        })();
    }, [uidChat]);


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

    const handleAddFriend = () => {
        Swal.fire({
            title: "Agregar un amigo.",
            input: "text",
            inputAttributes: {
                autocomplete: "off",
            },
            html: `
                <p>Escribe el amigo que deseas agregar<p/>
            `,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Agregar amigo",
            showLoaderOnConfirm: true,
            cancelButtonText: "Cerrar",
            width: 600,
            padding: "3em",
            color: "#716add",
            backdrop: `
                rgba(0,0,123,0.4)
                left top
                no-repeat
            `,
            preConfirm: async (emailBusqueda) => {
                try {
                    let userFind = usuarios.find(usuarioBusqueda => usuarioBusqueda[1].email === emailBusqueda);
                    if (!userFind) {
                        userFind = await getUserByEmail(db, emailBusqueda);
                        if (!userFind) return Swal.showValidationMessage(`El usuario no se encuentra registrado...`);
                        userFind = [...userFind][0];
                    }
                    await saveAmigo(userFind[1]);
                    setAmigosState(amigosState => [...amigosState, userFind]);
                    return userFind;
                } catch (error) {
                    Swal.showValidationMessage(`Error al intentar agregar el mensaje, por favor intenta de nuevo más tarde...`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Amigo agregado!',
                    text: `Has agregado a ${result.value[1].displayName}`
                });
            }
        })
    }

    const saveAmigo = async (newFriend) => {
        const postData = {
            uid: newFriend.uid,
            fecha: new Date().getTime(),
        };

        const amigoRef = ref(db, `amigos/${usuarioSesionUid}`);
        return push(amigoRef, postData);
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
                                            diffMinutes(ahora, amigoMap.lastLogin) <= 60
                                                ? <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
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