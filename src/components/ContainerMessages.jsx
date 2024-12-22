import { memo, useEffect, useRef, useState } from "react"
import { getFullMessage, getMessagesByPathQuery, getMessagesAtTimeNow, suscribeMessage, getMessages } from "@helpers";
import { userStore } from "@store/userStore";
import { Message } from "./Message";
import { MessageSkeleton } from "../skeleton/MessageSkeleton";

let isNuevoChatOMsgScroll = true;
let heighPosicionChat = 0;
let isAnimacionMensaje = false;
const fechaActual = new Date();

export const ContainerMessages = memo(({ usuarioSesionUid, uidChat }) => {
  const { pathStore, setPath } = userStore();

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const chatStartRef = useRef();
  const chatEndRef = useRef();


  // Al seleccionar un nuevo chat
  useEffect(() => {
    setPosts([]);
    if (!uidChat) return;

    setIsLoadingMessages(true);
    let unsubscribe = null;
    isNuevoChatOMsgScroll = true;
    isAnimacionMensaje = false;
    const [uidChat1, uidChat2] = [uidChat, usuarioSesionUid].sort();

    const newPath = `${uidChat1}/${uidChat2}`;

    (async () => {
      const postsRef = getMessagesByPathQuery(newPath);
      const responseMessages = await getMessages(postsRef);
      const responseVal = responseMessages.val();
      let responseArray = responseVal ? Object.entries(responseVal) : [];
      setPosts(responseArray);
      setPath(newPath);
      setPagination(null);
      unsubscribe = listenerUserMessages(newPath);
      setIsLoadingMessages(false);
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [uidChat]);

  // Listener en tiempo real para mensaje y consulta inicial
  const listenerUserMessages = (path) => {
    const postRefRealTime = getMessagesAtTimeNow(path);
    return suscribeMessage(postRefRealTime, snapshot => {
      const newMessage = snapshot.val();
      const messageDate = new Date(newMessage.fecha);
      if (messageDate > fechaActual) {
        isAnimacionMensaje = true;
      }
      isNuevoChatOMsgScroll = true;
      const arraySet = [[uidChat, newMessage]];
      setPosts(postsData => [...postsData, ...arraySet]);
    });
  }


  // Consulta de mensajes al subir el scroll a 0
  useEffect(() => {
    if (!pagination) return;
    (async () => {
      const { response } = await getFullMessage(pathStore, pagination);
      if (!response) return;

      // ordena por fecha
      const responseArray = Object.entries(response);
      const dataSort = responseArray.sort((a, b) => new Date(a[1].fecha) - new Date(b[1].fecha));
      setPosts(postState => [...dataSort, ...postState]);
    })();
  }, [pagination]);

  // Eventos del scroll
  useEffect(() => {
    if (!posts.length || isLoadingMessages) return;
    // Mueve el scroll a la parte de abajo cuando se consultan los mensajes al seleccionar un nuevo chat
    if (isNuevoChatOMsgScroll) {
      chatEndRef.current.scrollIntoView({
        block: 'end',
      });
      isNuevoChatOMsgScroll = false;

      // Cuando el scroll está en la posición 0 y se cargan nuevos mensajes
    } else if (chatStartRef.current && heighPosicionChat) {
      const { scrollHeight } = chatStartRef.current;
      const nuevPosScroll = scrollHeight - heighPosicionChat
      chatStartRef.current.scrollTo({
        top: nuevPosScroll
      });
    }

    // Evento para cuando se mueve el scroll
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
          isLoadingMessages 
            ? <MessageSkeleton />
            : (
              posts.map(([_, postContent], index) => (
                <Message
                  key={postContent.uidUnico}
                  usuarioSesionUid={usuarioSesionUid}
                  posts={posts}
                  postContent={postContent}
                  index={index}
                  isAnimacionMensaje={isAnimacionMensaje}
                />
              ))
            )
        }
      </div>

      < div ref={chatEndRef} />
    </div>
  )
})