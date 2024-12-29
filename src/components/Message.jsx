import { memo } from "react";
import { format } from "@formkit/tempo"
import { AudioMessage } from "./AudioMessage";

const areEqual = (prevProps, nextProps) => {
    return prevProps.postContent.uidUnico === nextProps.postContent.uidUnico;
};

export const Message = memo(({ postContent, usuarioSesionUid, posts, index, isAnimacionMensaje }) => {
    const isUserMessage = postContent.uid === usuarioSesionUid;
    const isLastMessage = index === posts.length - 1 && isAnimacionMensaje;

    return (
        <div
            className={`shadow-sm mb-3 rounded-lg p-4 max-w-[85%] 
            ${isUserMessage ? 'bg-gray-600 text-white ml-auto' : 'bg-gray-100 text-gray-800 mr-auto'} 
            ${isLastMessage ? 'animate-growFromBottom' : ''}`}
        >
            <div className="flex justify-between items-start gap-2">
                {postContent.type === "audio" ? (
                    <AudioMessage postContent={postContent} />
                ) : (
                    <p className="text-sm flex-grow break-words">{postContent.mensaje}</p>
                )}

                <small
                    className={`text-xs self-end ${isUserMessage ? 'text-white' : 'text-gray-500'}`}
                >
                    {format(new Date(postContent.fecha), { date: "short", time: "medium" })}
                </small>
            </div>
        </div>
    );
}, areEqual)