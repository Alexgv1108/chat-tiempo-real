import { useState } from "react";
import { Navbar, Loader, ListUsers, InputSendMessage, ContainerMessages } from "@components";
import { isDesktop } from 'react-device-detect';
import { stateSesionUser } from "@utils/stateSesionUser";

export const Chat = ({ usuarioSesion }) => {
    const [uidChat, setUidChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pathMessages, setPathMessages] = useState(null);
    const [showUsers, setShowUsers] = useState(false);

    // Listener para cuando se mueve el mouse, gestiona el estado en sesión
    stateSesionUser(usuarioSesion);

    return (
        <>
            {loading && (<Loader />)}

            <Navbar
                usuarioSesion={usuarioSesion}
            />
            <div className="grid grid-cols-4">
                <div className={`${ 
                    isDesktop ? 'col-span-1' 
                    : (showUsers ? 'left-0 col-span-4' : 'absolute -left-[300px]')
                }`}>
                    <ListUsers
                        usuarioSesion={usuarioSesion}
                        setLoading={setLoading}
                        uidChat={uidChat}
                        setUidChat={setUidChat}
                        setShowUsers={setShowUsers}
                    />
                </div>
                {/* Columna derecha: Contenido del chat */}
                <div className={`${isDesktop ? 'col-span-3' : 'col-span-4'} relative h-screen`}>
                    <div className="flex flex-col h-full">
                        {
                            <ContainerMessages
                                usuarioSesionUid={usuarioSesion.uid}
                                pathMessages={pathMessages}
                                uidChat={uidChat}
                                loading={loading}
                                setLoading={setLoading}
                                setPathMessages={setPathMessages}
                            />
                        }
                        <InputSendMessage
                            usuarioSesionUid={usuarioSesion.uid}
                            uidChat={uidChat}
                            pathMessages={pathMessages}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}