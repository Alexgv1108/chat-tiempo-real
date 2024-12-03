import { format } from "@formkit/tempo"
import { limitToLast, onChildAdded, query, ref } from "firebase/database";
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { getFullMessage } from "../helpers/GetMessage";

const fechaInicioPagina = new Date();
let isNuevoChatOMsgScroll = true;

export const ContainerMessages = memo(({
  db, usuarioSesionUid, pathMessages, setPathMessages, uidChat, loading, setLoading
}) => {

  const chatStartRef = useRef();
  const chatEndRef = useRef();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [heighPosicionChat, setHeighPosicionChat] = useState(0);

  // Al seleccionar un nuevo chat
  useEffect(() => {
    if (!uidChat) {
      if (posts) setPosts([]);
      return;
    }
    isNuevoChatOMsgScroll = true;
    const [uidChat1, uidChat2] = [uidChat, usuarioSesionUid].sort();
    setPathMessages(`${uidChat1}/${uidChat2}`);
    setPagination(null);
    setPosts([]);
  }, [uidChat]);

  // Listener en tiempo real para mensaje
  useEffect(() => {
    if (!pathMessages) return;
    const postsRef = query(ref(db, `chat/${pathMessages}`), limitToLast(1));
    const unsubscribe = onChildAdded(postsRef, snapshot => {
      const newMessage = snapshot.val();
      if (new Date(newMessage.fecha) > fechaInicioPagina) {
        isNuevoChatOMsgScroll = true;
        const arraySet = [[uidChat, newMessage]];
        setPosts(postsData => [...postsData, ...arraySet]);
      }
    });

    return () => unsubscribe();
  }, [pathMessages]);

  // Mueve el scroll a la parte de abajo cuando se consultan los mensajes al seleccionar un nuevo chat
  useEffect(() => {
    if (posts.length && isNuevoChatOMsgScroll) {
      chatEndRef.current.scrollIntoView({
        block: 'end',
      });
      isNuevoChatOMsgScroll = false;
    }
  }, [posts])

  // Consulta de mensajes al seleccionar un chat
  useEffect(() => {
    if (!pathMessages) return;
    (async () => {
      cambiarEstadoLoading(true);
      const { response } = await getFullMessage(db, pathMessages, pagination);
      if (!response) {
        cambiarEstadoLoading(false);
        return;
      }

      const responseArray = Object.entries(response);

      // ordena por fecha
      const dataSort = responseArray.sort((a, b) => new Date(a[1].fecha) - new Date(b[1].fecha));
      setPosts(postState => [...dataSort, ...postState]);
      cambiarEstadoLoading(false);
    })();
  }, [pathMessages, pagination]);

  useEffect(() => {
    if (!posts.length || !chatStartRef.current || !heighPosicionChat || loading) return;
    chatStartRef.current.scrollTo({
      top: heighPosicionChat
    });

  }, [posts]);

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

  const cambiarEstadoLoading = estado => {
    if (isNuevoChatOMsgScroll) setLoading(estado);
  }

  const handleScroll = () => {
    const position = chatStartRef.current?.scrollTop;
    if (position === 0) {
      setPagination(posts[0][1].fecha);
      const { clientHeight } = chatStartRef.current;
      setHeighPosicionChat(clientHeight);
    }
  };


  const getMessages = useMemo(() => {
    return posts.map(([uid, postContent], i) => (
      <div
        key={`${uid}-${postContent.uid}`}
        className={`shadow-sm mb-3 rounded-lg p-4 ${postContent.uid === usuarioSesionUid
          ? 'bg-gray-600 text-white ml-auto'
          : 'bg-gray-100 text-gray-800 mr-auto'
          }`}
        style={{
          maxWidth: "80%",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm flex-grow">{postContent.mensaje}</p>
          <small className="text-gray-500">{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
        </div>
      </div>
    ));
  }, [posts]);

  return (
    <div className="flex-grow overflow-auto">
      <div
        ref={chatStartRef}
        className="mt-24 ml-4 mr-4"
      >
        {getMessages}
      </div>
      <div ref={chatEndRef} />
    </div>
  )
})