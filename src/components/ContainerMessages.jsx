import { format } from "@formkit/tempo"
import { v4 } from "uuid"

export const ContainerMessages = ({posts, usuarioSesionUid}) => {
    return (
        <div style={{
            marginTop: "100px"
        }}>
            {
                posts.length === 0
                    ? <p className="text-center ">Escribe un mensaje para iniciar con la conversación.</p>
                    : posts.map(([_, postContent]) => (
                        <div key={v4()} className={`card mb-3 shadow-sm ${postContent.uid === usuarioSesionUid ? 'bg-secondary text-white ms-auto' : 'me-auto'}`
                        }
                            style={{
                                maxWidth: "80%", // Controla el ancho máximo de los mensajes
                            }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="card-text flex-grow-1">{postContent.mensaje}</p>
                                    <small>{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
                                </div>
                            </div>
                        </div>
                    ))
            }
        </div>
    )
}