import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseAuth } from "../firebase/config";

export const Navbar = memo(() => {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        navigate('/');
        await FirebaseAuth.signOut();
    }

    return (
        <>
            <nav
                className="navbar bg-body-tertiary w-100"
                style={{
                    height: "60px",
                    margin: "0",
                    padding: "0",
                    position: "absolute",
                    zIndex: '8888'
                }}>
                <div className="container-fluid">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page">Chat en tiempo real</a>
                        </li>
                    </ul>
                    <button className="btn btn-no-style navbar-text text-danger" onClick={handleSignOut}>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
        </>
    )
})