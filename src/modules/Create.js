import React from "react";

import CreateUser from '../components/CreateUser';

import Users from '../database/users.json';

class Create extends React.Component {

    state = {
        error: null
    };

    createUser = async (username, password) => {
        clearInterval(this.intervalId);
        await this.props.globalFunct('setLoading');
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
            <CreateUser
                globalFunct={this.props.globalFunct}
                createUser={this.createUser}
                error={this.state.error}
                loading={this.props.global.loading}
            />
        )
    }

}

export default Create;