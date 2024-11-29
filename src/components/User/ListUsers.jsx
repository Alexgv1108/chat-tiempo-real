import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

import defaultImage from '../../assets/image_user.png';

import './styles.css';

export const ListUsers = ({ usuarios, uidChat, showUsers, setShowUsers, setUidChat }) => {

    const handleChatear = uid => {
        if (uid === uidChat) return;
        setUidChat(uid);
        setShowUsers(false);
    }

    const handleImageError = (e) => {
        try {
            e.target.src = usuarios[2][1].photoURL;
        } catch (error) {
            e.target.src = defaultImage;
        }
    };

    const getUserList = useMemo(() => {
        if (!usuarios.length) return;
        return usuarios.map(([userId, userInfo]) => (
            <div
                className="item-hover mb-2"
                onClick={() => { handleChatear(userId) }}
                key={userId}
            >
                <li className={`list-group-item ${userId === uidChat ? 'active' : ''}`}>
                    <div className="d-flex align-items-center">
                        <img
                            className="me-3"
                            src={userInfo.photoURL || defaultImage}
                            onError={handleImageError}
                            loading="lazy"
                            alt={`Imagen de perfil del usuario ${userInfo.email}`}
                        />
                        <div className="d-flex flex-column justify-content-center">
                            <p className="mb-0">{userInfo.email}</p>
                            <small>{userInfo.displayName}</small>
                        </div>
                    </div>
                </li>
            </div>
        ));
    }, [usuarios, uidChat]);

    return (
        <>
            <button
                className="btn btn-primary d-md-none"
                style={{
                    position: "fixed",
                    right: "45px",
                    marginTop: "80px",
                    zIndex: "4000",
                    width: '150px'
                }}
                onClick={() => setShowUsers(!showUsers)}
            >
                <FontAwesomeIcon icon={faBars} />Usuarios
            </button>
            <div
                className={`offcanvas offcanvas-start ${showUsers ? "show" : ""}`}
                tabIndex="-1"
                style={{
                    visibility: showUsers ? "visible" : "hidden",
                    zIndex: "8888"
                }}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Usuarios</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowUsers(false)}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        {getUserList}
                    </ul>
                </div>
            </div>

            {/* Columna izquierda fija en pantallas grandes */}
            <div
                className="col-md-3 border-end bg-light d-none d-md-flex flex-column"
                style={{ height: "100vh" }}
            >
                <h5 className="p-3 border-bottom" style={{ marginTop: "70px" }}>Usuarios</h5>
                <ul className="list-group flex-grow-1 overflow-auto">
                    {getUserList}
                </ul>
            </div>
        </>
    )
}