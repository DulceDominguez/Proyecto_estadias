import './Login.css';
import Logo from '../../assets/logo.png';
import IconoMuela from '../../assets/icono_muela.png'
import { Mail, LockIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redireccionar

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState(false);
    const Navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault()

        try {
            const respuesta = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena })
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                localStorage.setItem("token", datos.access_token);
                Navigate('/inicio');
            } else {
                alert(datos.detail || "Error al iniciar sesion");
            }


        } catch (error) {
            console.error("Error al conectar con el servidor ", error)
        }

    }



    return (

        <form onSubmit={manejarLogin} className="pantalla">
            <div className="contenedor">
                <div className='seccion_logo'>
                    <img src={Logo} className='logo_img' />
                    <img src={IconoMuela} className='icono_muela' />
                </div>

                <div className='seccion_info'>
                    <h2>Inicio de Sesion</h2>
                    <div className='input'>
                        <Mail className='input_Icon' />
                        <input
                            type="email"
                            id="email"         // <-- Agregado
                            name="email"
                            placeholder="Correo"
                            className="input_text"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                    <div className='input'>
                        <LockIcon className='input_Icon' />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="input_text"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>
                    <button type="submit"><p>Entrar</p></button>
                </div>
            </div>

        </form >
    );

};