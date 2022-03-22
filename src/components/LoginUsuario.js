import React from "react";

import '../styles/Login.css';

import Loading from '../images/loading.svg';

const DARK_STYLE = 'dark';
const LIGHT_STYLE = 'light';
const MSG_ERROR_TRUE = 'is-error show';
const MSG_ERROR_FALSE = 'is-error hide';

const LoginRenderizar = props => {

    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    async function cambiarFondo() {
        document.body.className = await props.cambiarFondo() ? DARK_STYLE : LIGHT_STYLE;
    }

    const iniciarSesion = () => {
        props.iniciarSesion(user, password);
    }

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
                <h1>Iniciar sesión</h1>

                <input type="text" id="user" name="user" placeholder="Usuario" 
                    value={user} onChange={e => { setUser(e.target.value); } } />

                <input type="password" id="password" name="password" placeholder="Contraseña"
                    value={ password } onChange={e => { setPassword(e.target.value); } } />

                <button onClick={iniciarSesion}>Iniciar sesión</button>

                <div className={props.error ? MSG_ERROR_TRUE : MSG_ERROR_FALSE}>
                    <p>{props.error}</p>
                </div>
            </div>
        </div>
    );
}

export default LoginRenderizar;