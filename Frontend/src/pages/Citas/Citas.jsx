import React from "react";
import "./Citas.css";
import { useNavigate } from 'react-router-dom';

function Citas({ onAgendarClick }) {
    const navigate = useNavigate();
    // Datos simulados de las citas según el diseño del PDF
    const citasDelDia = [
        {
            id: 1,
            hora: "10:00",
            paciente: "Ana Lopez Garcia",
            tratamiento: "Limpieza",
            odontologo: "David Oswaldo Ontiveros Rubio",
            estatus: "Confirmada",
        },
        {
            id: 2,
            hora: "10:30",
            paciente: "Paola Perez Avila",
            tratamiento: "Extraccion",
            odontologo: "Jose Ruben Galvan Segovia",
            estatus: "Confirmada",
        },
        {
            id: 3,
            hora: "11:00",
            paciente: "Adriana Rodriguez Delgado",
            tratamiento: "Extraccion",

            estatus: "Confirmada",
        },
        {
            id: 4,
            hora: "11:30",
            paciente: "Jorge Lopez Dominguez",
            tratamiento: "Revision",
            odontologo: "Jose Ruben Galvan Segovia",
            estatus: "Confirmada",
        },
        {
            id: 5,
            hora: "12:00",
            paciente: "Lucia Aroña Quiñonez",
            tratamiento: "Limpieza",
            odontologo: "Jose Ruben Galvan Segovia",
            estatus: "Pendiente",
        },
        {
            id: 6,
            hora: "12:30",
            paciente: "Johan Carmona Rivera",
            tratamiento: "Revision",
            estatus: "Confirmada",
        },
    ];

    const handleConfirmar = (cita) => {
        navigate('/editar-cita', { state: { cita } })
    };

    return (
        <div className="citas-container">


            <div className="citas-subsections">
                <h3>Aqui tienes todas las citas de hoy</h3>
                <button className="btn-agendar" onClick={() => navigate('/nueva-cita')}>
                    + Agendar cita
                </button>
            </div>

            <div className="citas-lista">
                {citasDelDia.map((cita) => (
                    <div key={cita.id} className="cita-card">
                        <div className="cita-hora">{cita.hora}</div>
                        <div className="cita-info">
                            <span className="cita-paciente">{cita.paciente}</span>
                            <span className="cita-tratamiento">{cita.tratamiento}</span>
                        </div>
                        <div className="cita_acciones">
                            <div className={`cita-estatus ${cita.estatus.toLowerCase()}`}>
                                {cita.estatus}
                            </div>

                            <button
                                className="btn-editar"
                                onClick={() => handleConfirmar(cita)}
                            >
                                Editar
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Citas;
