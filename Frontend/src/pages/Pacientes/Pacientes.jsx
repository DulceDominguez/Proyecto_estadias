import React, { useState, useEffect } from "react";
import "./Pacientes.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function Pacientes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filtro = searchParams.get("filtro");

  const [listaPacientes, setListaPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tituloSeccion, setTituloSeccion] = useState(
    "Aquí tienes todos los pacientes registrados",
  );

  // Estado del modal y del formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    edad: "",
    telefono: "",
  });

  // Cargar pacientes desde FastAPI y aplicar filtro si viene de la tarjeta de inicio
  const obtenerPacientes = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/pacientes")
      .then((res) => res.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          if (filtro === "hoy") {
            // Opcional: si deseas filtrar solo pacientes con cita hoy, consultamos también las citas
            try {
              const resCitas = await fetch("http://127.0.0.1:8000/citas");
              const citasData = await resCitas.json();
              const hoyStr = new Date().toISOString().split("T")[0];

              // Nombres de pacientes que tienen cita hoy
              const nombresHoy = citasData
                .filter((c) => c.fecha === hoyStr)
                .map((c) => c.paciente.trim().toLowerCase());

              const pacientesFiltrados = data.filter((p) =>
                nombresHoy.includes(p.nombre.trim().toLowerCase()),
              );

              setListaPacientes(pacientesFiltrados);
              setTituloSeccion("Pacientes con cita programada para hoy");
            } catch (e) {
              console.error("Error cruzando citas para pacientes de hoy", e);
              setListaPacientes(data);
            }
          } else {
            setListaPacientes(data);
            setTituloSeccion("Aquí tienes todos los pacientes registrados");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar pacientes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    obtenerPacientes();
  }, [filtro]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaciente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgregarPaciente = async (e) => {
    e.preventDefault();
    if (
      !nuevoPaciente.nombre ||
      !nuevoPaciente.telefono ||
      !nuevoPaciente.edad
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const pacienteAEnviar = {
      nombre: nuevoPaciente.nombre,
      telefono: nuevoPaciente.telefono,
      edad: nuevoPaciente.edad.includes("años")
        ? nuevoPaciente.edad
        : `${nuevoPaciente.edad} años`,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacienteAEnviar),
      });

      if (response.ok) {
        alert("¡Paciente registrado con éxito!");
        setNuevoPaciente({ nombre: "", edad: "", telefono: "" });
        setMostrarModal(false);
        obtenerPacientes();
      } else {
        alert("Error al registrar el paciente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const handleDetalle = (paciente) => {
    navigate("/detalle-paciente", { state: { paciente } });
  };

  return (
    <div className="pacientes-container">
      <div className="pacientes-subsections">
        <h3>{tituloSeccion}</h3>
        <button
          className="btn-agregar-paciente"
          onClick={() => setMostrarModal(true)}
        >
          + Agregar paciente
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Cargando pacientes...
        </p>
      ) : listaPacientes.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No hay pacientes que coincidan con este filtro.
        </p>
      ) : (
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
      )}

      {/* MODAL NUEVO PACIENTE */}
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
                  placeholder="Ej. 25 años"
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
