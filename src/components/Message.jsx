import { format } from "@formkit/tempo"
import { faLessThanEqual, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { AudioMessage } from "./AudioMessage";

const areEqual = (prevProps, nextProps) => {
    return prevProps.postContent.uidUnico === nextProps.postContent.uidUnico;
};

let waveform = null;

export const Message = memo(({ postContent, usuarioSesionUid, posts, index, isAnimacionMensaje }) => {
    return (
        <div
            className={`shadow-sm mb-3 rounded-lg p-4
                ${postContent.uid === usuarioSesionUid
                    ? 'bg-gray-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-800 mr-auto'
                }
                ${index === (posts.length - 1) && isAnimacionMensaje ? 'animate-growFromBottom' : ''}
              `}
            style={{
                maxWidth: "85%",
            }}
        >
            <div className="flex justify-between items-center">
                {
                    postContent.type === 'audio'
                        ? <AudioMessage 
                            postContent={postContent}
                        />
                        : <p className="text-sm flex-grow">{postContent.mensaje}</p>
                }

                <small className={`${postContent.uid === usuarioSesionUid
                    ? 'text-white'
                    : 'text-gray-500'
                    }`}>{format(new Date(postContent.fecha), { date: "short", time: "medium" })}</small>
            </div>
        </div>
    )
}, areEqual)