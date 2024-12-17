import { diffMilliseconds, format } from '@formkit/tempo';
import { STATES_SESSION, TIME_TIME_OUT } from '@global/constantes';

export const User = ({ amigoMap, uidChat, ahora, setUidChat, setShowUsers }) => {

    const handleChatear = uid => {
        if (uid === uidChat) return;
        setUidChat(uid);
        setShowUsers(false);
    }

    const diffMinutesUser = (lastLogin, milliseconds) => {
        return diffMilliseconds(ahora, lastLogin) < milliseconds + 1;
    }

    return (
        <div
            className="item-hover mb-2"
            onClick={() => { handleChatear(amigoMap.uid) }}
        >
            <li className={`flex items-center py-2 cursor-pointer p-2 ${amigoMap.uid === uidChat ? 'bg-blue-100' : ''}`}>
                <div className="flex-1">
                    <p className="text-gray-700 text-left">{amigoMap.email}</p>
                    <small className="text-gray-700 text-left block">{amigoMap.displayName}</small>
                </div>
                <div className="flex items-center ml-auto"> {/* Este contenedor mantiene los íconos a la derecha */}
                    {
                        amigoMap.stateSession === STATES_SESSION.LOGIN && diffMinutesUser(amigoMap.lastLogin, TIME_TIME_OUT)
                            ? <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            : amigoMap.stateSession === STATES_SESSION.PENDING && diffMinutesUser(amigoMap.lastLogin, TIME_TIME_OUT * 2)
                                ? <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                : <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    }
                </div>
            </li>
            {amigoMap.stateSession !== STATES_SESSION.LOGIN && (
                <div className="mt-1 text-xs text-gray-600 ml-2">
                    Última conexión: 
                    {format(new Date(amigoMap.lastLogin), { date: "short", time: "medium" })}    
                </div>
  )}
        </div>
    )
}