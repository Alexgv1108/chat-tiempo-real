import { format } from "@formkit/tempo"
import { limitToLast, onChildAdded, query, ref } from "firebase/database";
import { memo, useEffect, useMemo, useState } from "react"
import { getFullMessage } from "../helpers/GetMessage";

const fechaInicioPagina = new Date();
let isNuevoChatOMsgScroll = true;

export const ContainerMessages = memo(({
  db, usuarioSesionUid, pathMessages, setPathMessages, uidChat, loading, setLoading, chatStartRef, chatEndRef
}) => {

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [heighPosicionChat, setHeighPosicionChat] = useState(0);

  // Al seleccionar un nuevo chat
  useEffect(() => {
    if (!uidChat || !usuarioSesionUid) return;
    isNuevoChatOMsgScroll = true;
    const [uidChat1, uidChat2] = [uidChat, usuarioSesionUid].sort();
    setPathMessages(`${uidChat1}/${uidChat2}`);
    setPagination(null);
    setPosts([]);
  }, [uidChat]);

  // Listener en tiempo real para mensaje
  useEffect(() => {
    if (!pathMessages || !usuarioSesionUid) return;
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
    if (!usuarioSesionUid || !pathMessages) return;
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
        className={`card mb-3 shadow-sm ${postContent.uid === usuarioSesionUid ? 'bg-secondary text-white ms-auto' : 'me-auto'}`}
        style={{
          maxWidth: "80%",
        }}
      >
        <div className="card-body" id={i === 0 ? 'uidTo' : i}>
          <div className="d-flex justify-content-between">
            <p className="card-text flex-grow-1">{postContent.mensaje}</p>
            <small>{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
          </div>
        </div>
      </div>
    ));
  }, [posts]);

  return (
    <div style={{
      marginTop: "100px"
    }}>
      { getMessages }
    </div>
  )
})