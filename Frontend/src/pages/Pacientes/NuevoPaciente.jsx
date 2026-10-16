import React, { useState } from "react";
import "./Pacientes.css";

function NuevoPaciente({ onCancelar, onGuardar }) {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [telefono, setTelefono] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre) {
            alert("Por favor ingresa el nombre del paciente");
            return;
        }
        onGuardar({ nombre, edad, telefono });
    };

    return (
        <div className="nuevo-paciente-container">
            <div className="nuevo-paciente-header">
                <button className="btn-flecha-back" onClick={onCancelar}>
                    ←
                </button>
                <h2>Registro de pacientes</h2>
            </div>

            <div className="form-paciente-card">
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="form-group full-width">
                        <label>Nombre</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    {/* Edad y Teléfono en dos columnas */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Edad</label>
                            <div className="input-with-icon">
                                <input
                                    type="date"
                                    value={edad}
                                    onChange={(e) => setEdad(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Telefono</label>
                            <input
                                type="text"
                                placeholder="Tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Botones de Guardar y Cancelar */}
                    <div className="form-actions-paciente">
                        <button type="submit" className="btn-guardar-paciente">
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="btn-cancelar-paciente"
                            onClick={onCancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NuevoPaciente;
