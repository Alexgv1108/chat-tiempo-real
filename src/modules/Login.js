import React from "react";

import LoginUsuario from '../components/LoginUsuario';

import Users from '../database/users.json';

class Login extends React.Component {
    state = {
        error: null,
    };

    iniciarSesion = async (username, password) => {
        await this.props.globalFunct('setLoading');
        clearInterval(this.intervalId);
        const usuarios = await Users;
        const credencialesCorrectas = usuarios.some(user => {
            return user.username === username && user.password === password;
        });
        
        this.setState({
            error: credencialesCorrectas ? null : 'Usuario y/o contraseña incorrecto(s)'
        });

        if (this.state.error) {
            this.intervalId = setInterval(() => {
                this.setState({
                    error: null
                });
                clearInterval(this.intervalId);
            }, 6000);
        }
        await this.props.globalFunct('setLoading');
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <LoginUsuario
                globalFunct={this.props.globalFunct}
                iniciarSesion={this.iniciarSesion}
                error={this.state.error}
                loading={this.props.global.loading}
            />
        );
    }
}

export default Login;