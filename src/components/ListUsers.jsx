export const ListUsers = ({ usuarios, uidChat, showUsers, setShowUsers, setUidChat }) => {

    const handleChatear = uid => {
        setUidChat(uid);
        setShowUsers(false);
    }

    return (
        <>
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
                        {
                            usuarios.map(([userId, userInfo]) => (
                                <div
                                    className="item-hover mb-2"
                                    onClick={() => { handleChatear(userId) }}
                                    key={userId}
                                >
                                    <li
                                        className={`list-group-item ${userId === uidChat ? 'active' : ''}`}
                                    >
                                        <p className="mb-0">{userInfo.email}</p>
                                        <small>{userInfo.displayName}</small>
                                    </li>


                                </div>
                            ))
                        }
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
                    {
                        usuarios.map(([userId, userInfo]) => (
                            <div
                                className="item-hover mb-2"
                                onClick={() => { handleChatear(userId) }}
                                key={userId}
                            >
                                <li
                                    className={`list-group-item ${userId === uidChat ? 'active' : ''}`}
                                >
                                    <p className="mb-0">{userInfo.email}</p>
                                    <small>{userInfo.displayName}</small>
                                </li>


                            </div>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}