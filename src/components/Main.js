import React from 'react';
import { Route, Routes } from 'react-router-dom'


import Login from '../modules/Login';
import Create from '../modules/Create';
import NotFound from './NotFound';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fondoDark: localStorage.getItem('fondoDark') === 'true',
            loading: false
        };
        this.DARK_STYLE = 'dark';
        this.LIGHT_STYLE = 'light';

        if (!localStorage.getItem('fondoDark')) {
            localStorage.setItem('fondoDark', false)
        }
    }

    functionesGlobales = funcionEjecutar => {
        let funciones = {}
        // Función que me alterna el fondo entre light y dark
        funciones.cambiarFondo = async () => {
            await this.setState({
                fondoDark: !this.state.fondoDark   
            });
            document.body.className = this.state.fondoDark ? this.DARK_STYLE : this.LIGHT_STYLE;
        };

        // Alterna el loading de la aplicación
        funciones.setLoading = async () => {
            await this.setState({
                loading: !this.state.loading
            });
        }

        return funciones[funcionEjecutar]();
    }

    render() {
        return (
            <Routes>
                <Route exact path="/" element={<Login global={this.state} globalFunct={this.functionesGlobales} />}/>
                <Route exact path="create-user" element={<Create global={this.state} globalFunct={this.functionesGlobales} />}/>
                <Route path="*" element={<NotFound global={this.state} globalFunct={this.functionesGlobales} />} />
            </Routes>
        );
    }
}

export default Main;