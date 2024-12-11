import { format } from "@formkit/tempo"
import { memo, useEffect, useRef, useState } from "react"
import { getFullMessage, getMessagesByPathQuery, suscribeMessage } from "@helpers";

let isNuevoChatOMsgScroll = true;
let heighPosicionChat = 0;
let isAnimacionMensaje = false;
const fechaActual = new Date();

export const ContainerMessages = memo(({
  usuarioSesionUid, pathMessages, setPathMessages, uidChat, loading, setLoading
}) => {

  const chatStartRef = useRef();
  const chatEndRef = useRef();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Al seleccionar un nuevo chat
  useEffect(() => {
    if (!uidChat) return;

    isNuevoChatOMsgScroll = true;
    isAnimacionMensaje = false;
    const [uidChat1, uidChat2] = [uidChat, usuarioSesionUid].sort();
    setPathMessages(`${uidChat1}/${uidChat2}`);
    setPosts([]);
    setPagination(null);
  }, [uidChat]);

  // Listener en tiempo real para mensaje y consulta inicial
  useEffect(() => {
    if (!pathMessages) return;
    setLoading(true);
    const postsRef = getMessagesByPathQuery(pathMessages);
    const unsubscribe = suscribeMessage(postsRef, snapshot => {
      const newMessage = snapshot.val();
      const messageDate = new Date(newMessage.fecha);
      if (messageDate > fechaActual ) {
        isAnimacionMensaje = true;
      }
      isNuevoChatOMsgScroll = true;
      const arraySet = [[uidChat, newMessage]];
      setPosts(postsData => [...postsData, ...arraySet]);
    });
    setLoading(false)

    return () => unsubscribe();
  }, [pathMessages]);

  // Consulta de mensajes al subir el scroll a 0
  useEffect(() => {
    if (!pagination) return;
    (async () => {
      const { response } = await getFullMessage(pathMessages, pagination);
      if (!response) return;

      // ordena por fecha
      const responseArray = Object.entries(response);
      const dataSort = responseArray.sort((a, b) => new Date(a[1].fecha) - new Date(b[1].fecha));
      setPosts(postState => [...dataSort, ...postState]);
    })();
  }, [pagination]);

  // Mueve el scroll a la parte de abajo cuando se consultan los mensajes al seleccionar un nuevo chat
  useEffect(() => {
    if (posts.length && isNuevoChatOMsgScroll) {
      chatEndRef.current.scrollIntoView({
        block: 'end',
      });
      isNuevoChatOMsgScroll = false;
    }
  }, [posts])

  // Cuando el scroll está en la posición 0 y se cargan nuevos mensajes
  useEffect(() => {
    if (!posts.length || !chatStartRef.current || !heighPosicionChat || loading) return;
    const { scrollHeight } = chatStartRef.current;
    const nuevPosScroll = scrollHeight - heighPosicionChat
    chatStartRef.current.scrollTo({
      top: nuevPosScroll
    });

  }, [posts]);

  // Evento para cuando se mueve el scroll
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

  const handleScroll = () => {
    if (!posts.length) return;
    const position = chatStartRef.current;
    // Se ajusta en 150 para que no sea necesario subir el scroll por completo
    if (position?.scrollTop < 150) {
      setPagination(posts[0][1].fecha);
      const { scrollHeight } = position;
      heighPosicionChat = scrollHeight;
    }
  };

  return (
    <div className="flex-grow overflow-auto" ref={chatStartRef}>
      <div className="mt-24 ml-4 mr-4">
        {
          posts.map(([_, postContent], index) => (
            <div
              key={postContent.uidUnico}
              className={`shadow-sm mb-3 rounded-lg p-4
                ${postContent.uid === usuarioSesionUid
                  ? 'bg-gray-600 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800 mr-auto'
                }
                ${ index === (posts.length - 1) && isAnimacionMensaje ? 'animate-growFromBottom' : ''}
              `}
              style={{
                maxWidth: "80%",
              }}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm flex-grow">{postContent.mensaje}</p>
                <small className={`${postContent.uid === usuarioSesionUid
                  ? 'text-white'
                  : 'text-gray-500'
                  }`}>{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
              </div>
            </div>
          ))
        }
      </div>
      <div ref={chatEndRef} />
    </div>
  )
})