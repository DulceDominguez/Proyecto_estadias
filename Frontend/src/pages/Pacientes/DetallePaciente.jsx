import React, { useState, useEffect } from "react";
import "./DetallePaciente.css";
import { useNavigate, useLocation } from "react-router-dom";

function DetallePaciente() {
  const navigate = useNavigate();
  const location = useLocation();

  const pacienteProps = location.state?.paciente || {};
  const pacienteId = pacienteProps.id;

  const [tabActiva, setTabActiva] = useState("citas");
  const [isEditing, setIsEditing] = useState(false);
  const [datosPaciente, setDatosPaciente] = useState({
    id: pacienteId || null,
    nombre: pacienteProps.nombre || "",
    telefono: pacienteProps.telefono || "",
    edad: pacienteProps.edad || "",
    citas: [],
    citasCanceladas: [],
    notas: [],
  });

  // Función para obtener los datos frescos del paciente y sus citas desde el backend
  const cargarDetallePaciente = async () => {
    if (!pacienteId) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/pacientes");
      const data = await response.json();
      // Buscamos al paciente actual en la lista general para traer sus citas actualizadas
      const pacienteActualizado = data.find((p) => p.id === pacienteId);
      if (pacienteActualizado) {
        setDatosPaciente(pacienteActualizado);
      }
    } catch (error) {
      console.error("Error al cargar citas del paciente:", error);
    }
  };

  useEffect(() => {
    cargarDetallePaciente();
  }, [pacienteId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPaciente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios (PUT /pacientes/{id})
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/pacientes/${datosPaciente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: datosPaciente.nombre,
            telefono: datosPaciente.telefono,
            edad: datosPaciente.edad,
          }),
        },
      );

      if (response.ok) {
        alert("¡Paciente actualizado con éxito!");
        setIsEditing(false);
        cargarDetallePaciente();
      } else {
        alert("Error al actualizar el paciente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    cargarDetallePaciente();
  };

  // Eliminar paciente (DELETE /pacientes/{id})
  const handleEliminar = async () => {
    const confirmar = window.confirm(
      `¿Estás segura de que deseas eliminar al paciente "${datosPaciente.nombre}"?`,
    );
    if (confirmar) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/pacientes/${datosPaciente.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          alert("Paciente eliminado correctamente");
          navigate("/pacientes");
        } else {
          alert("Error al eliminar el paciente.");
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* Header superior del módulo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          className="btn_volver"
          onClick={() => navigate("/pacientes")}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            padding: "8px 18px",
            borderRadius: "20px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Volver a lista
        </button>
      </div>

      {/* Recuadro de información con Editar y Eliminar */}
      <div className="dp-card-info">
        {isEditing ? (
          /* MODO EDICIÓN */
          <form
            onSubmit={handleSave}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              className="dp-avatar-section"
              style={{ flex: 1, minWidth: "280px" }}
            >
              <div className="dp-avatar-circle">👤</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  name="nombre"
                  value={datosPaciente.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  required
                />
                <input
                  type="text"
                  name="telefono"
                  value={datosPaciente.telefono}
                  onChange={handleInputChange}
                  placeholder="Número telefónico"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  required
                />
                <input
                  type="text"
                  name="edad"
                  value={datosPaciente.edad}
                  onChange={handleInputChange}
                  placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="dp-btn-editar">
                Guardar
              </button>
            </div>
          </form>
        ) : (
          /* MODO LECTURA NORMAL */
          <>
            <div className="dp-avatar-section">
              <div className="dp-avatar-circle">👤</div>
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0 0 6px 0",
                  }}
                >
                  {datosPaciente.nombre || "Sin nombre registrado"}
                </h3>
                <p style={{ margin: "3px 0", fontSize: "14px", color: "#444" }}>
                  📞 {datosPaciente.telefono || "Sin teléfono"}
                </p>
                <p style={{ margin: "3px 0", fontSize: "14px", color: "#444" }}>
                  🎂{" "}
                  {datosPaciente.edad
                    ? `${datosPaciente.edad} años`
                    : "Edad no especificada"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                className="dp-btn-editar"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleEliminar}
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fca5a5",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pestañas: Citas, Citas canceladas, Notas */}
      <div className="dp-tabs-container">
        <button
          className={`dp-tab-btn ${tabActiva === "citas" ? "active" : ""}`}
          onClick={() => setTabActiva("citas")}
        >
          Citas
        </button>
        <button
          className={`dp-tab-btn ${tabActiva === "canceladas" ? "active" : ""}`}
          onClick={() => setTabActiva("canceladas")}
        >
          Citas canceladas
        </button>
        <button
          className={`dp-tab-btn ${tabActiva === "notas" ? "active" : ""}`}
          onClick={() => setTabActiva("notas")}
        >
          Notas
        </button>
      </div>

      {/* Contenido de Citas Activas */}
      {tabActiva === "citas" && (
        <div className="dp-lista-citas">
          {datosPaciente.citas && datosPaciente.citas.length > 0 ? (
            datosPaciente.citas.map((cita, index) => (
              <div className="dp-item-cita" key={index}>
                <span>📅 {cita.fecha}</span>
                <span>⏰ {cita.hora}</span>
                <span>🦷 {cita.servicio}</span>
                <span className={`dp-badge ${cita.estado?.toLowerCase()}`}>
                  {cita.estado}
                </span>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: "center", padding: "30px", color: "#777" }}
            >
              No hay citas vigentes registradas para este paciente.
            </div>
          )}
        </div>
      )}

      {/* Contenido de Citas Canceladas */}
      {tabActiva === "canceladas" && (
        <div className="dp-lista-citas">
          {datosPaciente.citasCanceladas &&
          datosPaciente.citasCanceladas.length > 0 ? (
            datosPaciente.citasCanceladas.map((cita, index) => (
              <div className="dp-item-cita" key={index}>
                <span>📅 {cita.fecha}</span>
                <span>⏰ {cita.hora}</span>
                <span>🦷 {cita.servicio}</span>
                <span className="dp-badge cancelado">{cita.estado}</span>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: "center", padding: "30px", color: "#777" }}
            >
              No hay citas canceladas.
            </div>
          )}
        </div>
      )}

      {/* Contenido de Notas */}
      {tabActiva === "notas" && (
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {datosPaciente.notas && datosPaciente.notas.length > 0 ? (
            datosPaciente.notas.map((nota, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  <span>
                    📅 <strong>{nota.fecha}</strong>
                  </span>
                  <span>
                    🦷 <strong>{nota.servicio}</strong>
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#334155",
                    lineHeight: "1.5",
                  }}
                >
                  {nota.texto}
                </p>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: "center", padding: "30px", color: "#777" }}
            >
              No hay notas registradas para este paciente.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetallePaciente;
