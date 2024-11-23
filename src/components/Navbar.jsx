import { useNavigate } from "react-router-dom";
import { FirebaseAuth } from "../firebase/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


export const Navbar = ({ showUsers, setShowUsers }) => {

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
                    position: "absolute"
                }}>
                <div className="container-fluid">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Chat en tiempo real</a>
                        </li>
                    </ul>
                    <button className="btn btn-no-style navbar-text text-danger" onClick={handleSignOut}>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
            <button
                className="btn btn-primary d-md-none"
                style={{
                    position: "fixed",
                    right: "10px",
                    marginTop: "80px",
                    zIndex: "4000"
                }}
                onClick={() => setShowUsers(!showUsers)}
            >
                <FontAwesomeIcon icon={faBars} />Usuarios
            </button>
        </>
    )
}