import React from "react";

import LoginUsuario from '../components/LoginUsuario';

class Login extends React.Component {
    state = {
        fondoDark: false
    };

    cambiarFondo = () => {
        this.setState({
            fondoDark: !this.state.fondoDark   
        });
    }

    render() {
        return (
            <LoginUsuario 
                fondoDark={this.state.fondoDark} 
                cambiarFondo={this.cambiarFondo}
            />
        );
    }
}

export default Login;