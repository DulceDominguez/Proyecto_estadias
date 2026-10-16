import React, { useState } from "react";
import "./Pacientes.css";
import { useNavigate } from 'react-router-dom';


function Pacientes({ onVerPaciente }) {
    const navigate = useNavigate();

    // Lista inicial de pacientes
    const [listaPacientes, setListaPacientes] = useState([
        {
            id: 1,
            nombre: "Ana Lopez Garcia",
            telefono: "+52 618 123 4567",
            edad: "25 años",
        },
        {
            id: 2,
            nombre: "Paola Perez Avila",
            telefono: "+52 618 234 5678",
            edad: "30 años",
        },
    ]);

    // Estado del modal y del formulario
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoPaciente, setNuevoPaciente] = useState({
        nombre: "",
        edad: "",
        telefono: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoPaciente((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAgregarPaciente = (e) => {
        e.preventDefault();

        if (
            !nuevoPaciente.nombre ||
            !nuevoPaciente.telefono ||
            !nuevoPaciente.edad
        ) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const pacienteCreado = {
            id: Date.now(),
            nombre: nuevoPaciente.nombre,
            telefono: nuevoPaciente.telefono,
            edad: nuevoPaciente.edad.includes("años")
                ? nuevoPaciente.edad
                : `${nuevoPaciente.edad} años`,
        };

        setListaPacientes([pacienteCreado, ...listaPacientes]);
        setNuevoPaciente({ nombre: "", edad: "", telefono: "" });
        setMostrarModal(false);
    };

    const handleDetalle = (paciente) => {
        navigate('/detalle-paciente', { state: { paciente } })
    };

    return (
        <div className="pacientes-container">

            <div className="pacientes-subsections">
                <h3>Aqui tienes todos los pacientes registrados</h3>
                <button
                    className="btn-agregar-paciente"
                    onClick={() => setMostrarModal(true)}
                >
                    + Agregar paciente
                </button>
            </div>

            <div className="pacientes-lista">
                {listaPacientes.map((paciente) => (
                    <div key={paciente.id} className="paciente-card">
                        <div className="paciente-info-basica">
                            <div className="avatar-icon">👤</div>
                            <span className="paciente-nombre">{paciente.nombre}</span>
                        </div>
                        <button
                            className="btn-ver"
                            onClick={() => handleDetalle(paciente)}
                        >
                            Ver
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL SIN PLACEHOLDERS */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Registrar nuevo paciente</h3>

                        <form onSubmit={handleAgregarPaciente} className="modal-form">
                            <div className="form-group">
                                <label>Nombre completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={nuevoPaciente.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Edad</label>
                                <input
                                    type="text"
                                    name="edad"
                                    value={nuevoPaciente.edad}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={nuevoPaciente.telefono}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-modal-cancelar"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-modal-guardar">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pacientes;
