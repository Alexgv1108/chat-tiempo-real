import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, limitToLast, onChildAdded, query, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { Navbar, Loader, ListUsers, InputSendMessage, ContainerMessages } from "../../components/";
import { useNavigate } from "react-router-dom";
import { getFullMessage } from "../../helpers/GetMessage";
import Swal from "sweetalert2";
import { constantes } from "../../global/constantes";

const auth = getAuth();
const db = getDatabase();
const fechaInicioPagina = new Date();
let usuarioSesion = {};
let ultimaFechaPaginacion = null;
let isCargaCompleta = false;
let todosLosRegistrosConsultados = false;

const { CANTIDAD_MENSAJES } = constantes();

export const Chat = () => {

    const navigate = useNavigate();

    const chatStartRef = useRef();
    const chatEndRef = useRef();

    const [posts, setPosts] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [uidChat, setUidChat] = useState('');
    const [showUsers, setShowUsers] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [heighPosicionChat, setHeighPosicionChat] = useState(0);
    const [pathMessages, setPathMessages] = useState(null);

    // Listener para detectar sesión activa
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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
        const postsRef = ref(db, 'usuarios');
        try {
            const snapshot = await get(postsRef);
            const postsData = snapshot.val() || {};

            const postDataFilter = Object.entries(postsData).filter(([key]) => key !== usuarioSesion.uid);
            setUsuarios(postDataFilter);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Swal.fire('Ups', 'No se pudieron recuperar la lista de usuarios, por favor intenta de nuevo más tarde', 'warning');
            console.error("Error fetching data:", error);
        }
    }

    // Generación de clave única en relación a los dos chat
    useEffect(() => {
        if (!uidChat || !usuarioSesion.uid) return;
        const [uidChat1, uidChat2] = [uidChat, usuarioSesion.uid].sort();
        setPathMessages(`${uidChat1}/${uidChat2}`);
        setPagination(null);
    }, [uidChat]);


    // Listener en tiempo real para mensaje
    useEffect(() => {
        if (!pathMessages || !usuarioSesion.uid) return;
        isCargaCompleta = false;
        todosLosRegistrosConsultados = false;
        const postsRef = query(ref(db, `chat/${pathMessages}`), limitToLast(1));
        const unsubscribe = onChildAdded(postsRef, (snapshot) => {
            const newMessage = snapshot.val();
            if (new Date(newMessage.fecha) > fechaInicioPagina) {
                const arraySet = [[uidChat, newMessage]];
                setPosts(postsData => [...postsData, ...arraySet]);
            }
        });

        return () => unsubscribe();
    }, [pathMessages]);

    // Consulta de mensajes al seleccionar un chat
    useEffect(() => {
        if (!usuarioSesion.uid || !pathMessages || todosLosRegistrosConsultados) return;
        (async () => {
            if (!isCargaCompleta) setLoading(true);
            debugger;
            const { response } = await getFullMessage(db, pathMessages, pagination ? pagination : null);
            if (!response) {
                todosLosRegistrosConsultados = true;
                setLoading(false);
                return;
            }

            const responseArray = Object.entries(response);

            // ordena por fecha
            const dataSort = responseArray.sort((a, b) => new Date(a[1].fecha) - new Date(b[1].fecha));
            setPosts(postState => [...dataSort, ...postState]);
            if (!isCargaCompleta) setLoading(false);
        })();
    }, [pathMessages, pagination]);

    useEffect(() => {
        if (!posts.length || !chatStartRef.current || !heighPosicionChat || !isCargaCompleta || loading) return;
        chatStartRef.current.scrollTo({
            top: heighPosicionChat
        });

    }, [posts]);

    // Mueve el scroll hacia abajo
    useEffect(() => {
        if (loading || !posts.length || !chatEndRef.current || isCargaCompleta || todosLosRegistrosConsultados) return;
        if (!isCargaCompleta) scrollAbajo();
        if (chatStartRef.current?.scrollTop === 0 && CANTIDAD_MENSAJES <= posts.length) {
            if (ultimaFechaPaginacion === posts[0][1].fecha) return;
            ultimaFechaPaginacion = posts[0][1].fecha;
            setPagination(ultimaFechaPaginacion);
        } else isCargaCompleta = true
    }, [posts]);

    const handleScroll = () => {
        const position = chatStartRef.current?.scrollTop;
        if (position === 0) {
            setPagination(posts[0][1].fecha);
            const { clientHeight } = chatStartRef.current;
            setHeighPosicionChat(clientHeight);
        }
    };

    // Evento para cuando se mueve el mouse
    useEffect(() => {
        if (!uidChat || !posts.length || loading) return;
        const container = chatStartRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [posts]);

    const scrollAbajo = () => {
        chatEndRef.current.scrollIntoView({
            block: 'end',
        });
    }

    return (
        <>
            {loading && (<Loader />)}
            <Navbar showUsers={showUsers} setShowUsers={setShowUsers} />

            <div className="container-fluid">
                <div className="row">
                    <ListUsers
                        usuarios={usuarios}
                        uidChat={uidChat}
                        showUsers={showUsers}
                        setShowUsers={setShowUsers}
                        setUidChat={setUidChat}
                        setPosts={setPosts}
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
                                uidChat &&
                                <ContainerMessages
                                    posts={posts}
                                    usuarioSesionUid={usuarioSesion.uid}
                                />
                            }
                            <div ref={chatEndRef} />
                        </div>
                        {uidChat && (
                            <InputSendMessage
                                db={db}
                                usuarioSesionUid={usuarioSesion.uid}
                                uidChat={uidChat}
                                setPosts={setPosts}
                                pathMessages={pathMessages}
                                scrollAbajo={scrollAbajo}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}