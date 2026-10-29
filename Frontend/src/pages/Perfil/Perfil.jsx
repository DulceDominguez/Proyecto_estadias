import React, { useState, useEffect } from 'react';
import { Plus, LogOut, User, UserPlus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Registro from '../Registro/Registro.jsx';


import './Perfil.css';

export default function MenuPerfil() {
    const [isOpen, setIsOpen] = useState(false);
    const [openRegistro, setOpenRegistro] = useState(false);
    // Cambiamos false por un objeto vacío o null para evitar errores al leer propiedades
    const [usuarioData, setUsuarioData] = useState({ id: '', correo: '', nombre: '' });
    const navigate = useNavigate();

    const handleAbrirRegistro = () => {
        setIsOpen(false);
        console.log("Abrir modal de registro de dentista");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                setUsuarioData({
                    id: decoded.sub,
                    correo: decoded.correo,
                    nombre: decoded.nombre
                });
            } catch (error) {
                console.error("Token inválido", error);
            }
        }
    }, []); // <-- ¡MUY IMPORTANTE! Los corchetes vacíos hacen que esto se ejecute solo una vez al montar el componente.

    const handleLogOut = () => {
        localStorage.removeItem("token"); // Opcional pero recomendado para limpiar el token al salir
        navigate('/logout');
    };

    return (
        <div className="perfil-container">
            {/* Botón del Avatar */}
            <button
                className="avatar-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="avatar-circle" style={{ backgroundColor: " #a8e3f7" }} >
                    <User className='icono-usuario' />
                </div>
            </button>

            {/* Ventana Flotante (Dropdown) #dbe6ed */}
            {isOpen && (
                <div className="perfil-dropdown">
                    <div className="dropdown-header">
                        <div className="avatar-circle-large"> <User className='icono-usuario' /></div>
                        <div className="user-info">
                            <p className="user-name">{usuarioData.nombre || "Cargando..."}</p>
                            <p className="user-email">{usuarioData.correo || ""}</p>
                        </div>
                    </div>

                    <hr className="dropdown-divider" />

                    <button className="dropdown-item" onClick={() => setOpenRegistro(true)}>
                        <UserPlus size={18} />
                        <p>Agregar otro usuario</p>
                    </button>

                    <Registro isOpen={openRegistro} onClose={() => setOpenRegistro(false)} />

                    <hr className="dropdown-divider" />

                    <button className="dropdown-item text-danger" onClick={handleLogOut}>
                        <LogOut size={18} />
                        <p>Cerrar sesión</p>
                    </button>
                </div>
            )}
        </div>
    );
}