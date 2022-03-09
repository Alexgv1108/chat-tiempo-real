import React from "react";

import '../styles/Login.css';

const DARK_STYLE = 'dark';
const WHITE_STYLE = 'white';

function LoginRenderizar(props) {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <LoginUsuario 
            login={props}
            user={user}
            setUser={setUser}
            password={password}
            setPassword={setPassword}
        />
    );
}

class LoginUsuario extends React.Component {

    cambiarFondo = async () => {
        await this.props.login.cambiarFondo();
        document.body.className = this.props.login.fondoDark ? DARK_STYLE : WHITE_STYLE;
    }

    render() {
        return (
            <React.Fragment>
                <div className="contenedor">
                    <div className="contenido">
                        <h1>Iniciar sesión</h1>

                        <input type="text" id="user" name="user" placeholder="Usuario" 
                            value={this.props.user} onChange={e => { this.props.setUser(e.target.value); } } />

                        <input type="password" id="password" name="password" placeholder="Contraseña"
                            value={this.props.password} onChange={e => { this.props.setPassword(e.target.value); } } />

                        <button onClick={this.cambiarFondo}>Iniciar sesión</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LoginRenderizar;