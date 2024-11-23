import { format } from "@formkit/tempo"
import { memo, useMemo } from "react"

export const ContainerMessages = memo(({ posts, usuarioSesionUid }) => {

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
            {
                posts.length === 0
                    ? <p className="text-center ">Escribe un mensaje para iniciar con la conversación.</p>
                    : getMessages
            }
        </div>
    )
})