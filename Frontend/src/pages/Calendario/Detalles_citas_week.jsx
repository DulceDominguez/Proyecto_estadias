import React from "react";
import "./Detalles_cita.css";

export default function Detalles_citas({ cita, onClose }) {
    if (!cita) return null;

    // Convierte el objeto Date a texto legible (ej. "10:00")
    const formatearHora = (fechaObj) => {
        if (!fechaObj) return "";
        if (fechaObj instanceof Date) {
            return fechaObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        return fechaObj;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                {cita.esResumen ? (
                    <>
                        {cita.citasDelDia?.map((c, index) => (
                            <div key={c.id || index} className="cita-resumen-item">
                                <h4 className="cita-numero">Cita #{index + 1}</h4>
                                <p><strong>Paciente:</strong> {c.paciente}</p>
                                <p><strong>Horario:</strong> {c.hora_inicio} - {c.hora_fin}</p>
                                <p><strong>Tratamiento:</strong> {c.tratamiento}</p>
                                <p><strong>Odontólogo:</strong> {c.odontologo}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3>Detalles de la Cita</h3>
                        <p><strong>Paciente:</strong> {cita.paciente}</p>
                        <p><strong>Fecha:</strong> {cita.start instanceof Date ? cita.start.toLocaleDateString() : cita.fecha}</p>
                        <p><strong>Horario:</strong> {formatearHora(cita.start)} - {formatearHora(cita.end)}</p>
                        <p><strong>Tratamiento:</strong> {cita.tratamiento}</p>
                        <p><strong>Odontólogo:</strong> {cita.odontologo}</p>
                        <p><strong>Estatus:</strong> {cita.estatus || "No especificado"}</p>
                        <p><strong>Notas:</strong> {cita.notas || "Sin notas"}</p>
                    </>
                )}

                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}