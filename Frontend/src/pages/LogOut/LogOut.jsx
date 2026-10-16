import './logout.css';
import Logo from '../../assets/logo.png';
import IconoMuela from '../../assets/icono_muela.png'
import { Mail, LockIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redireccionar

export default function LogOut() {

    const navigate = useNavigate(); // Nota: es recomendable usar minúscula por convención de hooks

    // Función que se ejecuta al hacer clic en toda la pantalla
    const handlePantallaClick = () => {
        navigate('/'); // Te redirige a la ruta de inicio
    };

    return (
        <div className="pantalla" onClick={handlePantallaClick} style={{ cursor: 'pointer' }}>
            <div className="contenedor">
                <div className='seccion_logo'>
                    <img src={Logo} className='logo_img' alt="Logo" />
                    <img src={IconoMuela} className='icono_muela' alt="Icono muela" />
                </div>
            </div>
        </div>
    );
}
