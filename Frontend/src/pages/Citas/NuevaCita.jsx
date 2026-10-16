import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // <-- Faltaba importar esto

import "./Citas.css";

function NuevaCita({ onCancelar, onGuardar }) {
    const location = useLocation(); // <-- Declarar location
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState("");
    const [fecha, setFecha] = useState("2026-09-28");
    const [hora, setHora] = useState("13:45");
    const [tratamiento, setTratamiento] = useState("");
    const [odontologo, setOdontologo] = useState("");
    const [notas, setNotas] = useState("");

    // Simulación de pacientes desde la BD
    const pacientesBD = [
        { id: 1, nombre: "Ana Lopez Garcia" },
        { id: 2, nombre: "Paola Perez Avila" },
        { id: 3, nombre: "Adriana Rodriguez Delgado" },
        { id: 4, nombre: "Jorge Lopez Dominguez" },
        { id: 5, nombre: "Lucia Aroña Quiñonez" },
        { id: 6, nombre: "Johan Carmona Rivera" },
        { id: 7, nombre: "Jazmin Dominguez" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!paciente) {
            alert("Por favor selecciona un paciente");
            return;
        }

        onGuardar({ paciente, fecha, hora, tratamiento, odontologo, notas });
        navigate('/citas')
    };

    return (
        <div className="citas-container-new">

            <div className="form-card">
                <h3 className="form-title">Nueva Cita</h3>

                <form onSubmit={handleSubmit} className="form-grid">
                    {/* Campo Paciente con menú desplegable */}
                    <div className="form-field full-width">
                        <label>Paciente</label>
                        <select
                            value={paciente}
                            onChange={(e) => setPaciente(e.target.value)}
                        >
                            <option value="">Selecciona un paciente</option>
                            {pacientesBD.map((p) => (
                                <option key={p.id} value={p.nombre}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="form-field date">
                        <label>Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Hora</label>
                        <input
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                        />
                    </div>

                    {/* Tipo de tratamiento */}
                    <div className="form-field">
                        <label>Tipo de tratamiento</label>
                        <select
                            value={tratamiento}
                            onChange={(e) => setTratamiento(e.target.value)}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Revisión">Revisión</option>
                            <option value="Validación ortodoncia (general)">
                                Validación ortodoncia (general)
                            </option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Resinas">Resinas</option>
                            <option value="Restauraciones">Restauraciones</option>
                            <option value="Colocación de brackets">
                                Colocación de brackets
                            </option>
                            <option value="Retiro de brackets">Retiro de brackets</option>
                            <option value="Endodoncia">Endodoncia</option>
                            <option value="Limpieza profunda">Limpieza profunda</option>
                            <option value="Cirugía">Cirugía</option>
                            <option value="Extracción (de diente)">
                                Extracción (de diente)
                            </option>
                            <option value="Dolor (prioridad)">Dolor (prioridad)</option>
                            <option value="Asistencia ortodoncia (bracket despegado)">
                                Asistencia ortodoncia (bracket despegado)
                            </option>
                        </select>
                    </div>

                    {/* Odontólogo */}
                    <div className="form-field">
                        <label>Odontólogo</label>
                        <select
                            value={odontologo}
                            onChange={(e) => setOdontologo(e.target.value)}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="David Oswaldo Ontiveros Rubio">
                                David Oswaldo Ontiveros Rubio
                            </option>
                            <option value="Jose Ruben Galvan Segovia">
                                Jose Ruben Galvan Segovia
                            </option>
                            <option value="Nora Luisa de la Hoya Lazalde">
                                Nora Luisa de la Hoya Lazalde
                            </option>
                        </select>
                    </div>

                    {/* Notas */}
                    <div className="form-field full-width">
                        <label>Notas</label>
                        <textarea
                            rows="4"
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Botones */}
                    <div className="form-actions full-width">
                        <button type="button" className="btn-cancelar" onClick={() => navigate('/citas')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NuevaCita;
