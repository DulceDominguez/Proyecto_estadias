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

    const manejarLogin = () => {
        if (correo == 'admin@gmail.com' && contrasena == '1234') {
            setError(false);
            Navigate('/inicio');
        } else {
            setError(true);
        }
    }

    return (

        <div className="pantalla">
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
                    <button onClick={manejarLogin}><p>Entrar</p></button>
                </div>
            </div>

        </div >
    );
}