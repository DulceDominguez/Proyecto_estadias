import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // <-- Faltaba importar esto
import "./Citas.css";

function EditarCita({ onCancelar, onActualizar }) {
    const location = useLocation(); // <-- Declarar location
    const navigate = useNavigate(); // <-- Declarar navigate

    const citaAEditar = location.state?.cita || {};

    const [paciente, setPaciente] = useState(citaAEditar.paciente || "");
    const [fecha, setFecha] = useState(citaAEditar.fecha || "2026-09-28");
    const [hora, setHora] = useState(citaAEditar.hora || "");
    const [tratamiento, setTratamiento] = useState(citaAEditar.tratamiento || "");
    const [odontologo, setOdontologo] = useState(citaAEditar.odontologo || "");
    const [estatus, setEstatus] = useState(citaAEditar.estatus || "Pendiente");
    const [notas, setNotas] = useState(citaAEditar.notas || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!paciente) {
            alert("Por favor selecciona un paciente");
            return;
        }

        // Definir la variable antes de usarla
        const citaActualizada = {
            id: citaAEditar.id,
            paciente,
            fecha,
            hora,
            tratamiento,
            odontologo,
            estatus,
            notas
        };

        console.log("Cita actualizada:", citaActualizada);
        if (onActualizar) {
            onActualizar(citaActualizada);
        }

        // Regresar a la pantalla de citas (ajusta la ruta según tu router, ej: '/' o '/citas')
        navigate('/citas');
    };

    return (
        <div className="citas-container-new">
            <div className="form-card">
                <h3 className="form-title">Editar Cita</h3>

                <form onSubmit={handleSubmit} className="form-grid3">

                    {/* Campo Paciente (Solo lectura / Bloqueado para que no cambie) */}
                    <div className="row">
                        <div className="form-field">
                            <label>Paciente</label>
                            <input
                                type="text"
                                value={paciente}
                                disabled
                            />
                        </div>

                        {/* Estatus (Modificable) */}
                        <div className="form-field select-estatus">
                            <label>Estatus</label>
                            <select
                                value={estatus}
                                onChange={(e) => setEstatus(e.target.value)}
                            >
                                <option value="Confirmada">Confirmada</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="row">
                        <div className="form-field">
                            <label>Fecha</label>
                            <input
                                disabled
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label>Hora</label>
                            <input
                                disabled
                                type="time"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tipo de tratamiento y Odontólogo */}
                    <div className="row">
                        <div className="form-field">
                            <label>Tipo de tratamiento</label>
                            <select
                                value={tratamiento}
                                onChange={(e) => setTratamiento(e.target.value)}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Revisión">Revisión</option>
                                <option value="Validación ortodoncia (general)">Validación ortodoncia (general)</option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Resinas">Resinas</option>
                                <option value="Restauraciones">Restauraciones</option>
                                <option value="Colocación de brackets">Colocación de brackets</option>
                                <option value="Retiro de brackets">Retiro de brackets</option>
                                <option value="Endodoncia">Endodoncia</option>
                                <option value="Limpieza profunda">Limpieza profunda</option>
                                <option value="Cirugía">Cirugía</option>
                                <option value="Extracción (de diente)">Extracción (de diente)</option>
                                <option value="Dolor (prioridad)">Dolor (prioridad)</option>
                                <option value="Asistencia ortodoncia (bracket despegado)">Asistencia ortodoncia (bracket despegado)</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Odontólogo</label>
                            <select
                                value={odontologo}
                                onChange={(e) => setOdontologo(e.target.value)}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="David Oswaldo Ontiveros Rubio">David Oswaldo Ontiveros Rubio</option>
                                <option value="Jose Ruben Galvan Segovia">Jose Ruben Galvan Segovia</option>
                                <option value="Nora Luisa de la Hoya Lazalde">Nora Luisa de la Hoya Lazalde</option>
                            </select>
                        </div>
                    </div>

                    {/* Notas */}
                    <div className="form-field full-width">
                        <label>Notas</label>
                        <textarea
                            rows="4"
                            value={notas}
                            disabled
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

export default EditarCita;