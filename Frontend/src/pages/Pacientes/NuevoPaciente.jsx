import React, { useState } from "react";
import "./Pacientes.css";

function NuevoPaciente({ onCancelar, onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !telefono || !edad) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoPacienteData = {
      nombre: nombre,
      telefono: telefono,
      edad: edad.includes("años") ? edad : `${edad} años`,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPacienteData),
      });

      if (response.ok) {
        alert("¡Paciente registrado con éxito!");
        if (onGuardar) onGuardar(nuevoPacienteData);
      } else {
        alert("Error al registrar el paciente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
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
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          {/* Edad y Teléfono */}
          <div className="form-row">
            <div className="form-group">
              <label>Edad</label>
              <input
                type="text"
                placeholder="Ej. 25 años"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Botones */}
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
