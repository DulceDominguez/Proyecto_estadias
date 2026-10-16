import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import icono_muela from '../assets/icono_muela.png';
import { Home, CalendarCheck, CalendarDays, User, LogOut } from 'lucide-react';


import './Navbar.css';


export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);

    };

    const obtenerFechaActual = () => {
        const hoy = new Date();
        const opciones = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const fecha = hoy.toLocaleDateString("es-ES", opciones);
        return fecha.charAt(0).toUpperCase() + fecha.slice(1);
    };

    return (
        <header className='header-container'>


            <div className='top-bar'>

                <button className='hamburger-btn' onClick={toggleMenu}>☰</button>

                <div className={`logo-box ${menuAbierto ? 'menu-abierto' : ''}`}>
                    <img src={logo} alt="Logo de la Empresa" className="logo-img" />
                </div>

                <span >
                    {obtenerFechaActual()}
                </span>




            </div>

            {
                menuAbierto && (
                    <div className='menu-desplegable'>
                        <div className='top-items-menu'>
                            <button className="close-btn" onClick={toggleMenu}>✕</button>

                            <div className="menu-header-img">
                                <img src={icono_muela} alt="Encabezado del menú" />
                            </div>
                        </div>
                        <nav className="menu-links">
                            {/* Lista de enlaces: se muestra u oculta según el estado */}
                            <Link to="/inicio" onClick={toggleMenu} >
                                <Home className="link-icono" />
                                <span>Inicio</span>
                            </Link>
                            <Link to="/citas" onClick={toggleMenu}>
                                <CalendarCheck className='link-icono' />
                                <span>Citas</span>
                            </Link>
                            <Link to="/calendario" onClick={toggleMenu}>
                                <CalendarDays className='link-icono' />
                                <span>Calendario</span>
                            </Link>
                            <Link to="/pacientes" onClick={toggleMenu}>
                                <User className='link-icono-user' />
                                <span>Pacientes</span>
                            </Link>
                            <Link to="/logout" onClick={toggleMenu} >
                                <LogOut className='link-icono' />
                                <span>Cerrar sesion</span>
                            </Link>

                        </nav>
                    </div>
                )
            }

        </header >
    );
}