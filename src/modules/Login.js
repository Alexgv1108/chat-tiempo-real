import React from "react";

import LoginUsuario from '../components/LoginUsuario';

import Users from '../database/users.json';

class Login extends React.Component {
    state = {
        username: null,
        password: null,
        fondoDark: false,
        error: null,
        loading: false
    };

    setLoading = async isLoading => {
        this.setState({
            loading: isLoading
        });
    }

    cambiarFondo = async () => {
        await this.setState({
            fondoDark: !this.state.fondoDark   
        });

        return await this.state.fondoDark;
    }

    iniciarSesion = async (username, password) => {
        await this.setLoading(true);
        debugger;
        const usuarios = await Users;
        const credencialesCorrectas = await usuarios.some(user => {
            return user.username === username && user.password === password;
        });
        
        this.setState({
            error: await credencialesCorrectas ? null : 'Usuario y/o contraseña incorrecto(s)'
        });

        if (await this.state.error) {
            this.intervalId = await setInterval(() => {
                this.setState({
                    error: null
                });
                clearInterval(this.intervalId);
            }, 6000);
        }
        await this.setLoading(false);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <LoginUsuario 
                fondoDark={this.state.fondoDark} 
                cambiarFondo={this.cambiarFondo}
                iniciarSesion={this.iniciarSesion}
                error={this.state.error}
                loading={this.state.loading}
            />
        );
    }
}

export default Login;