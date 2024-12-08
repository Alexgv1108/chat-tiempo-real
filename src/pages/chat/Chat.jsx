import { getDatabase } from "firebase/database";
import { useState } from "react";
import { Navbar, Loader, ListUsers, InputSendMessage, ContainerMessages } from "@components";
import { isDesktop } from 'react-device-detect';

const db = getDatabase();

export const Chat = ({ usuarioSesion }) => {
    const [uidChat, setUidChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pathMessages, setPathMessages] = useState(null);
    const [showUsers, setShowUsers] = useState(false);

    return (
        <>
            {loading && (<Loader />)}

            <Navbar />
            <div className="grid grid-cols-4">
                <div className={`${ 
                    isDesktop ? 'col-span-1' 
                    : (showUsers ? 'left-0 col-span-4' : 'absolute -left-[300px]')
                }`}>
                    <ListUsers
                        db={db}
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
                                db={db}
                                usuarioSesionUid={usuarioSesion.uid}
                                pathMessages={pathMessages}
                                uidChat={uidChat}
                                loading={loading}
                                setLoading={setLoading}
                                setPathMessages={setPathMessages}
                            />
                        }
                        <InputSendMessage
                            db={db}
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