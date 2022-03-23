import React from "react";
import { Link } from 'react-router-dom';

import '../styles/Login.css';

import Loading from '../images/loading.svg';

const CreateUser = props => {
    
    const MSG_ERROR_TRUE = 'is-error show';
    const MSG_ERROR_FALSE = 'is-error hide';
    
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');

    if (props.loading) {
        return (
            <div className="loading">
                <img src={Loading} alt="Cargando página" />
            </div>
        )
    }

    return (
        <div className="contenedor">
            <div className="contenido">
                <form>
                    <h1 onClick={() => { props.globalFunct('cambiarFondo'); }}>Crear usuario</h1>

                    <input type="text" id="user" name="user" placeholder="Usuario" 
                        value={user} onChange={e => { setUser(e.target.value); } } />

                    <input type="password" id="password" name="password" placeholder="Contraseña"
                        value={ password } onChange={e => { setPassword(e.target.value); } } />

                    <Link to="/">Iniciar sesión</Link>

                    <button onClick={() => { props.createUser(user, password); }}>Crear usuario</button>

                    <div className={props.error ? MSG_ERROR_TRUE : MSG_ERROR_FALSE}>
                        <p>{props.error}</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;