import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./Registro.css";
import AlertExito from './AlertaExito';

export default function ModalAgregarUsuario({ isOpen, onClose }) {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [alertaExito, setAlertaExito] = useState(false);

    if (!isOpen) return null;
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoUsuarioData = {
            nombre: nombre,
            correo: correo,
            contrasena_hash: contrasena
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoUsuarioData)
            });

            if (response.ok) {
                setAlertaExito(true);

            } else {
                alert("Error al registrar el paciente.");

            }


        } catch (error) {
            console.error("Error de red", error);
            alert("No se logro conectar con el servidor");
        }

    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Agregar Nuevo Usuario</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <input type="text"
                        placeholder="Nombre completo "
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <input type="email"
                        placeholder="Correo electrónico "
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <input type="password"
                        placeholder="Contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        maxLength="72"
                        required
                    />
                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar">
                            Guardar usuario
                        </button>
                        <AlertExito
                            isOpen={alertaExito}
                            mensaje="El usuario se ha registrado correctamente en el sistema"
                            onClose={() => {
                                setAlertaExito(false);
                                onClose();
                            }}
                        />

                    </div>

                </form>
            </div>

        </div>
    );

}