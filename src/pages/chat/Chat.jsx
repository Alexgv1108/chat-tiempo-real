import { useState } from "react";
import { Navbar, ListUsers, InputSendMessage, ContainerMessages } from "@components";
import { isDesktop } from 'react-device-detect';
import { stateSesionUser } from "@utils/stateSesionUser";
import { userStore } from "@store/userStore";

export const Chat = ({ usuarioSesion }) => {
    const [uidChat, setUidChat] = useState(null);

    const { showUsers } = userStore();

    // Listener para cuando se mueve el mouse, gestiona el estado en sesión
    stateSesionUser(usuarioSesion);

    // toDo: mostrar ventana sin conexión...
    return (
        <>
            <Navbar
                usuarioSesion={usuarioSesion}
            />
            <div className="grid grid-cols-4">
                <div className={`${isDesktop ? 'col-span-1'
                    : (showUsers ? 'left-0 col-span-4' : 'absolute -left-[300px]')
                    }`}>
                    <ListUsers
                        usuarioSesion={usuarioSesion}
                        uidChat={uidChat}
                        setUidChat={setUidChat}
                    />
                </div>
                {/* Columna derecha: Contenido del chat */}
                <div className={`${isDesktop ? 'col-span-3' : 'col-span-4'} relative h-screen`}>
                    <div className="flex flex-col h-full">
                        <ContainerMessages
                            usuarioSesionUid={usuarioSesion.uid}
                            uidChat={uidChat}
                        />

                        <InputSendMessage
                            usuarioSesionUid={usuarioSesion.uid}
                            uidChat={uidChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}