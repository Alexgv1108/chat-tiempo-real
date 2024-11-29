import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { Navbar, Loader, ListUsers, InputSendMessage, ContainerMessages } from "../../components/";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { validateSession } from "../../utils/validateSession";

const db = getDatabase();
let usuarioSesion = {};

export const Chat = () => {

    const navigate = useNavigate();

    const chatStartRef = useRef();
    const chatEndRef = useRef();

    const [usuarios, setUsuarios] = useState([]);
    const [uidChat, setUidChat] = useState('');
    const [showUsers, setShowUsers] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pathMessages, setPathMessages] = useState(null);

    // Listener para detectar sesión activa
    useEffect(() => {
        const unsubscribeAuth = validateSession((user) => {
            if (user) {
                if (usuarioSesion.uid) return;
                usuarioSesion = user;
                getListaUsuarios();
            } else {
                Swal.fire('Ups', 'No has iniciado sesión', 'warning');
                navigate('/');
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Consulta inicial de lista de usuarios registrados
    const getListaUsuarios = async () => {
        if (usuarios.length) return;
        setLoading(true);
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
    }

    return (
        <>
            { loading && (<Loader />) }
            <Navbar />

            <div className="container-fluid">
                <div className="row">
                    <ListUsers
                        usuarios={usuarios}
                        uidChat={uidChat}
                        showUsers={showUsers}
                        setShowUsers={setShowUsers}
                        setUidChat={setUidChat}
                    />

                    {/* Columna derecha: Contenido del chat */}
                    <div className="col-md-9 col-12 d-flex flex-column">
                        <div
                            style={{
                                flexGrow: 1,
                                overflowY: "auto",
                                height: "calc(100vh - 70px)"
                            }}
                            ref={chatStartRef}
                        >
                            {
                                <ContainerMessages
                                    db={db}
                                    usuarioSesionUid={usuarioSesion.uid}
                                    pathMessages={pathMessages}
                                    uidChat={uidChat}
                                    loading={loading}
                                    setLoading={setLoading}
                                    chatStartRef={chatStartRef}
                                    chatEndRef={chatEndRef}
                                    setPathMessages={setPathMessages}
                                />
                            }
                            <div ref={chatEndRef} />
                        </div>
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